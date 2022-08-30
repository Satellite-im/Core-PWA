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
import type {
  SyncFetchResponse,
  SyncSubscriptionResponse,
} from '@satellite-im/iridium/src/sync/agent'
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
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'
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

  public state: State = {
    conversations: {},
  }

  public ephemeral: { typing: { [key: string]: string[] } } = { typing: {} }

  private _intervals: { [key: string]: any } = {}

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    const fetched = await this.get<State>()
    this.state.conversations = fetched?.conversations || {}
    const conversations = Object.values(this.state.conversations)
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize chat manager, no iridium connector')
    }

    iridium.p2p.on<
      IridiumPubsubMessage<IridiumDecodedPayload<SyncFetchResponse>>
    >('node/message/sync/fetch', this.onSyncFetchResponse.bind(this))

    iridium.subscribe<
      IridiumPubsubMessage<IridiumDecodedPayload<IridiumConversationEvent>>
    >('/chat/announce', {
      handler: this.onConversationAnnounce.bind(this),
    })

    if (!iridium.p2p.primaryNodeID) {
      throw new Error('not connected to primary node')
    }

    logger.info('iridium/chatmanager/init', 'p2p ready, initializing chat...', {
      node: iridium.p2p.primaryNodeID,
    })
    // sync fetch
    await iridium.p2p.send(iridium.p2p.primaryNodeID, {
      type: 'sync/fetch',
    })

    for (const conversation of conversations) {
      const topic = `/chat/conversations/${conversation.id}`
      logger.info(
        'iridium/chatmanager/init',
        `requesting sync subscription to ${topic}`,
      )
      // ask the sync node to subscribe to this topic
      await iridium.subscribe<ConversationPubsubEvent>(topic, {
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
        const user = this.iridium.users.getUser(did)
        if (user) {
          return user
        }
        return this.iridium.users.searchPeer(did)
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
    if (!this.iridium.connector?.p2p.primaryNodeID) {
      return
    }
    await Promise.all(
      message.payload.body.messages.map(async (message) => {
        const stored = await this.iridium.connector?.dag.get(
          CID.parse(message.cid),
        )
        if (!stored.body) {
          return
        }
        const buffer = await this.iridium.connector?.did.decryptJWE(stored.body)
        const payload: any = buffer && json.decode(buffer)
        if (stored.topic) {
          logger.info(
            'iridium/chatmanager',
            'sync/fetch/message - emitting synced message',
            message,
          )
          await this.iridium.connector?.pubsub.emit(stored.topic, {
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
    await this.iridium.connector?.p2p.send(
      this.iridium.connector?.p2p.primaryNodeID,
      {
        type: 'sync/delivered',
        messages: message.payload.body.messages?.map(
          (message: { cid: string }) => message.cid,
        ),
      },
    )
    logger.info('iridium/chatmanager', 'sync/fetch/messages - done')
  }

  get<T = IridiumDocument>(path: string = '', options: any = {}) {
    return this.iridium.connector?.get<T>(`/chat${path}`, options)
  }

  set(path: string = '', payload: any, options: IridiumSetOptions = {}) {
    return this.iridium.connector?.set(`/chat${path}`, payload, options)
  }

  async onConversationMessage(
    conversationId: string,
    { from, payload }: ConversationPubsubEvent,
  ) {
    if (!this.iridium.connector) {
      return
    }
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
        message = await this.iridium.connector.load(cid)
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

      this.state.conversations[conversationId].message = {
        ...this.state.conversations[conversationId].message,
        [message.id]: message,
      }
      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )

      // Remove is_typing indicator upon user message receive
      clearTimeout(this.iridium.webRTC.timeoutMap[message.from])
      this.ephemeral.typing[conversationId] = (
        this.ephemeral.typing[conversationId] || []
      ).filter((did) => did !== message.from)

      const friendName = this.iridium.users.getUser(message?.from)
      const buildNotification: Exclude<Notification, 'id'> = {
        fromName: friendName?.name || message.from,
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
        image: message.from,
        type:
          conversation.participants.length > 2
            ? NotificationType.GROUP_MESSAGE
            : NotificationType.DIRECT_MESSAGE,
        seen: false,
      }

      this.iridium.notifications?.sendNotification(buildNotification)
    } else if (type === 'chat/reaction') {
      const reaction = payload.body.reaction
      if (!reaction) {
        return
      }
      const reactionsPath = `/conversations/${reaction.conversationId}/message/${reaction.messageId}/reactions/${reaction.userId}`
      const message = this.getConversationMessage(
        reaction.conversationId,
        reaction.messageId,
      )

      this.state.conversations[conversationId].message = {
        ...this.state.conversations[conversationId].message,
        [message.id]: message,
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

  async hasDirectConversation(did: string) {
    if (!this.iridium.connector) {
      return
    }
    const participants = [this.iridium.connector?.id, did]
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
    await this.iridium.connector?.subscribe(`/chat/conversations/${id}`, {
      sync: { offline: true },
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

    await this.iridium.connector?.publish('/chat/announce', event, {
      encrypt: {
        recipients: participants,
      },
    })

    return id
  }

  async addMembersToGroup(id: string, newMembers: string[]) {
    if (!this.iridium.connector) {
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

    await this.iridium.connector.publish('/chat/announce', event, {
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

    await this.iridium.connector.publish('/chat/announce', event, {
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
    if (!this.iridium.connector) {
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
      participants: [this.iridium.connector.id],
    }

    await this.iridium.connector.publish('/chat/announce', event, {
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
    this.state.conversations = Object.keys(this.state.conversations)
      .filter((k) => k !== id)
      .reduce((acc, key: string) => {
        acc[key] = this.state.conversations[key]
        return acc
      }, {} as { [key: string]: Conversation })

    this.set('/conversations', this.state.conversations)
    await this.iridium.connector?.unsubscribe(`/chat/conversations/${id}`)
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
    upload: ChatFileUpload,
    options?: AddOptions,
  ): Promise<MessageAttachment> {
    if (upload.file.size === 0) {
      throw new Error('TODO')
    }
    const thumbnailBlob = await createThumbnail(upload.file, 400)

    return {
      id: (await this.upload(upload.file, options)).path,
      name: upload.file.name,
      size: upload.file.size,
      nsfw: await isNSFW(upload.file),
      type: Object.values(FILE_TYPE).includes(upload.file.type as FILE_TYPE)
        ? (upload.file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: thumbnailBlob
        ? (await this.upload(thumbnailBlob, options)).path
        : '',
    }
  }

  async upload(file: Blob, options?: AddOptions): Promise<AddResult> {
    return await (this.iridium.connector?.ipfs as IPFS).add(
      blobToStream(file),
      options,
    )
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given groupChat
   */
  async sendMessage(payload: ConversationMessagePayload) {
    if (!this.iridium.connector) {
      return
    }

    const { conversationId } = payload
    const conversation = this.getConversation(conversationId)
    const partial: Omit<ConversationMessage, 'id'> = {
      ...payload,
      from: this.iridium.connector.id,
      reactions: {},
      attachments: payload.attachments,
    }
    const messageID = (
      await this.iridium.connector.store(partial, {
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

    this.state.conversations[conversationId].message = {
      ...this.state.conversations?.[conversationId]?.message,
      [message.id]: message,
    }

    this.state.conversations[conversationId] = {
      ...this.state.conversations[conversationId],
      lastReadAt: Date.now(),
    }
    await this.set(
      `/conversations/${conversationId}`,
      this.state.conversations[conversationId],
    )

    // broadcast the message to connected peers
    await this.iridium.connector.publish(
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
    if (!this.iridium.connector) {
      return
    }

    const did = this.iridium.connector.id
    const { conversationId, messageId } = payload
    const message = this.getConversationMessage(conversationId, messageId)

    const path = `/conversations/${conversationId}/message/${messageId}/reactions/${did}`

    let reactions = (message.reactions && message.reactions[did]) ?? []

    const shouldRemove = reactions.includes(payload.reaction)
    if (shouldRemove) {
      reactions = reactions.filter((reaction) => reaction !== payload.reaction)
    } else {
      reactions.push(payload.reaction)
    }

    message.reactions = { ...message.reactions, [did]: reactions }
    this.set(path, reactions)

    const reaction: MessageReaction = {
      conversationId,
      messageId,
      userId: did,
      reactions,
    }
    // broadcast the message to connected peers
    await this.iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/reaction',
        reaction,
      },
    )
  }

  setTyping(conversationId: string, did: string, typing: boolean = true) {
    this.ephemeral.typing[conversationId] = {
      ...this.ephemeral.typing[conversationId],
      [did]: typing,
    }
  }
}
