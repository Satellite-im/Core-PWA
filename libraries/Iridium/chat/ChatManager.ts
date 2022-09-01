import {
  didUtils,
  Emitter,
  IridiumMessage,
  IridiumPubsubMessage,
  IridiumSetOptions,
  encoding,
  IridiumDocument,
} from '@satellite-im/iridium'
import type { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import type { AddOptions, AddResult } from 'ipfs-core-types/root'
import type { IPFS } from 'ipfs-core-types'
import { CID } from 'multiformats'
import * as json from 'multiformats/codecs/json'
import type { EmitterCallback } from '@satellite-im/iridium'
import type { SyncFetchResponse } from '@satellite-im/iridium/src/sync/agent'
import { v4 } from 'uuid'
import {
  ChatError,
  Conversation,
  ConversationMessage,
  ConversationMessagePayload,
  IridiumConversationEvent,
  MessageAttachment,
  MessageReaction,
  MessageReactionPayload,
} from '~/libraries/Iridium/chat/types'
import { Friend } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { ChatFileUpload } from '~/store/chat/types'
import createThumbnail from '~/utilities/Thumbnail'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import { blobToStream } from '~/utilities/BlobManip'
import isNSFW from '~/utilities/NSFW'
import {
  Notification,
  NotificationType,
} from '~/libraries/Iridium/notifications/types'
export type ConversationPubsubEvent = IridiumMessage<
  IridiumDecodedPayload<{
    message?: ConversationMessage
    cid?: string
    type: 'chat/message' | 'chat/reaction'
    reaction?: MessageReaction
  }>
>

export type State = {
  conversations: { [key: string]: Conversation }
}

const initialState: State = {
  conversations: {},
}

export type Conversations = {
  [key: string]: ConversationMessage[]
}

export default class ChatManager extends Emitter<ConversationMessage> {
  public ready: boolean = false
  public state: State = initialState
  public ephemeral: { typing: { [key: string]: string[] } } = { typing: {} }

  async init() {
    const fetched = await this.get<State>()
    this.state.conversations = {
      ...this.state.conversations,
      ...(fetched?.conversations || {}),
    }
    const conversations = Object.values(this.state.conversations)
    this.ephemeral.typing = Object.keys(this.state.conversations).reduce(
      (acc: { [key: string]: string[] }, key: string) => {
        acc[key] = []
        return acc
      },
      {},
    )

    iridium.connector?.p2p.on<
      IridiumPubsubMessage<IridiumDecodedPayload<SyncFetchResponse>>
    >('node/message/sync/fetch', this.onSyncFetchResponse.bind(this))

    iridium.connector?.subscribe<
      IridiumPubsubMessage<IridiumDecodedPayload<IridiumConversationEvent>>
    >('/chat/announce', {
      handler: this.onConversationAnnounce.bind(this),
    })

    for (const conversation of conversations) {
      const topic = `/chat/conversations/${conversation.id}`
      logger.info(
        'iridium/chatmanager/init',
        `requesting sync subscription to ${topic}`,
      )
      // ask the sync node to subscribe to this topic
      await iridium.connector?.subscribe<ConversationPubsubEvent>(topic, {
        sync: {
          offline: true,
        },
        handler: this.onConversationMessage.bind(this, conversation.id),
      })
    }
    this.ready = true
    this.emit('ready', {})
  }

  private async onConversationAnnounce(
    message: IridiumPubsubMessage<
      IridiumDecodedPayload<IridiumConversationEvent>
    >,
  ) {
    const payload = message.payload.body

    const participants = payload.participants?.map((did) => did.toString())
    if (!participants) {
      return
    }

    await Promise.all(
      participants.map((did) => {
        const user = iridium.users.getUser(did)
        if (user) {
          return user
        }
        return iridium.users.searchPeer(did)
      }),
    )

    if (payload.type === 'create') {
      await this.createConversation({
        id: payload.id,
        type: 'group',
        name: payload.name,
        participants,
      })
    } else if (payload.type === 'add_member') {
      await this.appendParticipantsToConversation(payload.id, participants)
    } else if (payload.type === 'remove_member') {
      await this.removeParticipantsFromConversation(payload.id, participants)
    }
  }

  async onSyncFetchResponse(
    message: IridiumPubsubMessage<IridiumDecodedPayload<SyncFetchResponse>>,
  ) {
    if (!message.payload.body.messages) {
      return
    }
    if (!iridium.connector?.p2p.primaryNodeID) {
      return
    }
    await Promise.all(
      message.payload.body.messages.map(async (message) => {
        const stored = await iridium.connector?.dag.get(CID.parse(message.cid))
        if (!stored.body) {
          return
        }
        const buffer = await iridium.connector?.did.decryptJWE(stored.body)
        const payload: any = buffer && json.decode(buffer)
        if (stored.topic) {
          logger.info(
            'iridium/chatmanager',
            'sync/fetch/message - emitting synced message',
            message,
          )
          await iridium.connector?.pubsub.emit(stored.topic, {
            from: stored.from,
            topic: stored.topic,
            payload: { type: 'jwe', body: payload },
          })
        }
      }),
    )
    logger.info(
      'iridium/chatmanager',
      'sync/fetch/messages - sending delivery receipt',
      message.payload.body.messages,
    )
    // let the sync node know we've stored these messages
    await iridium.connector?.p2p.send(iridium.connector?.p2p.primaryNodeID, {
      type: 'sync/delivered',
      messages: message.payload.body.messages?.map(
        (message: { cid: string }) => message.cid,
      ),
    })
    logger.info('iridium/chatmanager', 'sync/fetch/messages - done')
  }

  get<T = IridiumDocument>(path: string = '', options: any = {}) {
    return iridium.connector?.get<T>(
      `/chat${path === '/' ? '' : path}`,
      options,
    )
  }

  set(path: string = '', payload: any, options: IridiumSetOptions = {}) {
    return iridium.connector?.set(
      `/chat${path === '/' ? '' : path}`,
      payload,
      options,
    )
  }

  async onConversationMessage(
    conversationId: string,
    { from, payload }: ConversationPubsubEvent,
  ) {
    if (!iridium.connector) {
      return
    }
    const fromDID = didUtils.didString(from)
    const conversation = this.getConversation(conversationId)
    if (
      !conversation ||
      !conversation.participants.includes(didUtils.didString(from))
    ) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    const { type, cid } = payload.body
    if (type === 'chat/message') {
      let message: ConversationMessage
      if (cid) {
        message = await iridium.connector.load(cid)
        message.id = cid
      } else if (payload.body.message) {
        message = payload.body.message
      } else {
        throw new Error('no message in payload')
      }

      logger.info(
        'iridium/chatmanager/onConversationMessage',
        'message received',
        { message, cid, from, conversationId },
      )

      this.state.conversations[conversationId] = {
        ...this.state.conversations[conversationId],
        message: {
          ...this.state.conversations[conversationId].message,
          [message.id]: message,
        },
      }
      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )

      // Remove is_typing indicator upon user message receive
      this.ephemeral.typing = {
        ...this.ephemeral.typing,
        [conversationId]: (
          this.ephemeral.typing?.[conversationId] || []
        ).filter((did) => did !== fromDID),
      }

      const friendName = iridium.users.getUser(message?.from)
      const buildNotification: Exclude<Notification, 'id'> = {
        fromName: friendName?.name || fromDID,
        at: Date.now(),
        fromAddress: conversationId,
        chatName: conversation.participants.length > 2 ? conversation.name : '',
        title:
          conversation.participants.length > 2
            ? `${friendName?.name} posted in ${conversation.name}`
            : `New message from ${friendName?.name}`,
        description:
          message.body?.length! > 79
            ? `${message.body?.substring(0, 80)}...`
            : message.body || '',
        image: fromDID,
        type:
          conversation.participants.length > 2
            ? NotificationType.GROUP_MESSAGE
            : NotificationType.DIRECT_MESSAGE,
        seen: false,
      }

      iridium.notifications?.sendNotification(buildNotification)
    } else if (type === 'chat/reaction') {
      const reaction = payload.body.reaction
      logger.info('iridium/chatmanager/onConversationMessage', 'reaction', {
        reaction,
        from,
        conversationId,
      })
      if (!reaction) {
        return
      }
      const message = this.getConversationMessage(
        reaction.conversationId,
        reaction.messageId,
      )
      message.reactions = {
        ...message.reactions,
        [fromDID]: reaction.reactions,
      }

      this.state.conversations[conversationId] = {
        ...this.state.conversations[conversationId],
        message: {
          ...this.state.conversations[conversationId].message,
          [message.id]: message,
        },
      }
      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )
    }
  }

  hasConversation(id: string) {
    return Object.keys(this.state.conversations).includes(id)
  }

  lastMessageTimestamp(conversation: Conversation): number {
    const messages = Object.values(
      this.state.conversations[conversation.id].message,
    ).sort((a, b) => a.at - b.at)
    return messages.at(-1)?.at ?? (conversation.updatedAt || 0)
  }

  getSortedConversations(): Conversation[] {
    return Object.values(this.state.conversations).sort(
      (a, b) => this.lastMessageTimestamp(b) - this.lastMessageTimestamp(a),
    )
  }

  async hasDirectConversation(did: string) {
    if (!iridium.connector) {
      return
    }
    const participants = [iridium.id, did]
    const id = await encoding.hash(participants.sort())
    return this.hasConversation(id)
  }

  /**
   * @param {string} friendDid
   * @description fetch direct conversation id based on friend did.
   * significantly faster than Iridium.hash until about 5,000,000 conversation records
   */
  directConversationIdFromDid(friendDid: Friend['did']): string | undefined {
    return Object.values(this.state.conversations).find(
      (c) => c.type === 'direct' && c.participants.includes(friendDid),
    )?.id
  }

  async generateConversationId(
    type: Conversation['type'],
    participants: Conversation['participants'],
  ): Promise<string> {
    if (type === 'group') {
      return v4()
    }
    return await encoding.hash(participants.sort())
  }

  async createConversation({
    id,
    type,
    name,
    participants,
  }: {
    id?: string
    type: Conversation['type']
    name: Conversation['name']
    participants: Conversation['participants']
  }): Promise<string> {
    if (!id) {
      id = await this.generateConversationId(type, participants)
    }
    if (id && type === 'direct' && this.hasConversation(id)) {
      throw new Error(ChatError.CONVERSATION_EXISTS)
    }

    const conversation: Conversation = {
      id,
      type,
      name,
      participants,
      message: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastReadAt: 0,
    }
    this.state.conversations = {
      ...this.state.conversations,
      [id]: conversation,
    }
    await this.set(`/conversations/${id}`, conversation)
    this.emit(`conversations/${id}`, conversation)

    // ask the sync node to subscribe to this topic
    await iridium.connector?.subscribe(`/chat/conversations/${id}`, {
      sync: { offline: true },
      handler: this.onConversationMessage.bind(this, id),
    })

    return id
  }

  async updateConversationReadAt(
    conversationId: string,
    readAt: number,
  ): Promise<void> {
    const conversation = this.getConversation(conversationId)
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    conversation.lastReadAt = readAt
    conversation.updatedAt = Date.now()
    this.state.conversations = {
      ...this.state.conversations,
      [conversationId]: conversation,
    }
    await this.set(`/conversations/${conversationId}`, conversation)
    this.emit(`conversations/${conversationId}`, conversation)
  }

  async createGroupConversation({
    name,
    participants,
  }: {
    name: Conversation['name']
    participants: Conversation['participants']
  }): Promise<string> {
    const id = await this.createConversation({
      type: 'group',
      name,
      participants,
    })

    const event: IridiumConversationEvent = {
      id,
      type: 'create',
      name,
      participants,
    }

    await iridium.connector?.publish('/chat/announce', event, {
      encrypt: {
        recipients: participants,
      },
    })

    return id
  }

  async addMembersToGroup(id: string, newMembers: string[]) {
    if (!iridium.connector) {
      throw new Error('no iridium connector')
    }

    const conversation = this.getConversation(id)
    if (!conversation) {
      throw new Error('conversation not found')
    }

    for (const participant of conversation.participants) {
      if (newMembers.includes(participant)) {
        throw new Error(`already a member: ${participant}`)
      }
    }

    // notify existing members of conversation about the new members
    let event: IridiumConversationEvent = {
      id,
      type: 'add_member',
      participants: newMembers,
    }

    await iridium.connector.publish('/chat/announce', event, {
      encrypt: {
        recipients: conversation.participants,
      },
    })

    // locally append the new members to our state
    this.appendParticipantsToConversation(id, newMembers)

    // notify the new membes of the conversation
    event = {
      id,
      type: 'create',
      name: conversation.name,
      participants: conversation.participants,
    }

    await iridium.connector.publish('/chat/announce', event, {
      encrypt: {
        recipients: newMembers,
      },
    })

    // send a message in the conversation
    await this.sendMessage({
      conversationId: id,
      type: 'member_join',
      members: newMembers,
      at: Date.now(),
      attachments: [],
      payload: {},
    })
  }

  async appendParticipantsToConversation(id: string, participants: string[]) {
    const conversation = this.getConversation(id)
    if (!conversation) {
      throw new Error('conversation not found')
    }
    conversation.participants.push(...participants)

    await this.set(
      `/conversations/${id}/participants`,
      conversation.participants,
    )
  }

  async leaveGroup(id: string) {
    if (!iridium.connector) {
      throw new Error('no iridium connector')
    }

    const conversation = this.getConversation(id)
    if (!conversation) {
      throw new Error('conversation not found')
    }

    // send a message in the conversation
    await this.sendMessage({
      conversationId: id,
      type: 'member_leave',
      at: Date.now(),
      attachments: [],
      payload: {},
    })

    const event: IridiumConversationEvent = {
      id,
      type: 'remove_member',
      participants: [iridium.id],
    }

    await iridium.connector.publish('/chat/announce', event, {
      encrypt: {
        recipients: conversation.participants,
      },
    })

    await this.deleteConversation(id)
  }

  async removeParticipantsFromConversation(id: string, participants: string[]) {
    const conversation = this.getConversation(id)
    if (!conversation) {
      throw new Error('conversation not found')
    }
    conversation.participants = conversation.participants.filter(
      (did) => !participants.includes(did),
    )

    await this.set(
      `/conversations/${id}/participants`,
      conversation.participants,
    )
  }

  async deleteConversation(id: string) {
    delete this.state.conversations[id]
    this.state = {
      conversations: { ...this.state.conversations },
    }

    this.set('/conversations', this.state.conversations)
    await iridium.connector?.unsubscribe(`/chat/conversations/${id}`)
  }

  getConversation(id: Conversation['id']): Conversation | undefined {
    return this.state.conversations[id]
  }

  getConversationMessage(
    conversationId: string,
    messageId: string,
  ): ConversationMessage {
    const conversation = this.state.conversations[conversationId]
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    const message = conversation.message[messageId]
    if (!message) {
      throw new Error(ChatError.MESSAGE_NOT_FOUND)
    }
    return message
  }

  /**
   * @method subscribeToConversation
   * @description Adds a watcher to conversation activity
   * @param id {string} conversation id
   * @param onMessage {EmitterCallback<IridiumMessage>} function to be called
   */
  async subscribeToConversation(
    id: string,
    onMessage: EmitterCallback<ConversationMessage>,
  ) {
    this.on(`conversations/${id}`, onMessage)
  }

  /**
   * @method unsubscribeFromConversation
   * @description Removes a watcher from conversation activity
   * @param id {string} conversation id
   * @param onMessage {EmitterCallback<IridiumMessage>} function to be removed
   */
  async unsubscribeFromConversation(
    id: string,
    onMessage?: EmitterCallback<ConversationMessage>,
  ) {
    this.off(`conversations/${id}`, onMessage)
  }

  async addFile(
    {
      upload,
      conversationId,
    }: { upload: ChatFileUpload; conversationId: string },
    options?: AddOptions,
  ): Promise<MessageAttachment | false> {
    if (upload.file.size === 0) {
      throw new Error('TODO')
    }
    const safer = await this.upload(upload.file, conversationId)
    if (!safer) {
      return false
    }
    const thumbnailBlob = await createThumbnail(upload.file, 400)
    return {
      cid: safer.cid,
      name: upload.file.name,
      size: upload.file.size,
      nsfw: await isNSFW(upload.file),
      safe: safer.valid,
      type: Object.values(FILE_TYPE).includes(upload.file.type as FILE_TYPE)
        ? (upload.file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: thumbnailBlob,
    }
  }

  async upload(
    file: File,
    conversationId: string,
  ): Promise<{ cid: string; valid: boolean } | undefined> {
    const conversation = this.getConversation(conversationId)
    if (!iridium.connector?.p2p.primaryNodeID) {
      throw new Error('not connected to primary node')
    }
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }

    const fileBuffer = await file.arrayBuffer()
    const cid = await iridium.connector?.store(
      { fileBuffer, name: file.name, size: file.size, type: file.type },
      {
        syncPin: true,
        encrypt: {
          recipients: [
            ...conversation.participants,
            iridium.connector?.p2p.primaryNodeID,
          ],
        },
      },
    )

    return new Promise((resolve) => {
      iridium.connector?.p2p.once('node/message/sync/pin', (msg: any) => {
        const { payload } = msg
        const { body } = payload
        if (body.originalCID === cid.toString()) {
          resolve({ cid: body.cid, valid: body.valid })
        }
        setTimeout(() => resolve(undefined), 30000)
      })
    })
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given groupChat
   */
  async sendMessage(payload: ConversationMessagePayload) {
    if (!iridium.connector) {
      return
    }

    const { conversationId } = payload
    const conversation = this.getConversation(conversationId)
    const partial: Omit<ConversationMessage, 'id'> = {
      ...payload,
      from: iridium.id,
      reactions: {},
      attachments: payload.attachments,
    }
    const messageID = (
      await iridium.connector.store(partial, {
        syncPin: true,
        encrypt: conversation?.participants
          ? { recipients: conversation?.participants }
          : undefined,
      })
    ).toString() as string
    const message: ConversationMessage = {
      ...partial,
      id: messageID,
    }
    if (message.id === undefined) {
      throw new Error('message not sent, failed to store')
    }

    this.state.conversations = {
      ...this.state.conversations,
      [conversationId]: {
        ...this.state.conversations[conversationId],
        message: {
          ...this.state.conversations?.[conversationId]?.message,
          [message.id]: message,
        },
        lastReadAt: Date.now(),
      },
    }
    await this.set(
      `/conversations/${conversationId}`,
      this.state.conversations[conversationId],
    )

    // broadcast the message to connected peers
    await iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/message',
        cid: message.id,
      },
      {
        encrypt: conversation?.participants
          ? { recipients: conversation.participants }
          : undefined,
      },
    )
  }

  async toggleMessageReaction(payload: MessageReactionPayload) {
    if (!iridium.connector) {
      return
    }

    const did = iridium.id
    const { conversationId, messageId } = payload
    const message = this.getConversationMessage(conversationId, messageId)

    let reactions = (message.reactions && message.reactions[did]) ?? []

    const shouldRemove = reactions.includes(payload.reaction)
    if (shouldRemove) {
      reactions = reactions.filter((reaction) => reaction !== payload.reaction)
    } else {
      reactions.push(payload.reaction)
    }

    message.reactions = { ...message.reactions, [did]: reactions }
    const path = `/conversations/${conversationId}/message/${messageId}`
    this.set(path, message)

    const reaction: MessageReaction = {
      conversationId,
      messageId,
      userId: did,
      reactions,
    }
    // broadcast the message to connected peers
    await iridium.connector.publish(`/chat/conversations/${conversationId}`, {
      type: 'chat/reaction',
      reaction,
    })
  }

  setTyping(conversationId: string, did: string, typing: boolean = true) {
    this.ephemeral.typing = {
      ...this.ephemeral.typing,
      [conversationId]: {
        ...this.ephemeral.typing[conversationId],
        [did]: typing,
      },
    }
  }
}
