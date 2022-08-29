import Vue from 'vue'
import type { EmitterCallback } from '@satellite-im/iridium'
import {
  didUtils,
  Emitter,
  encoding,
  IridiumMessage,
  IridiumPubsubMessage,
  IridiumSetOptions,
} from '@satellite-im/iridium'
import type { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import type { AddOptions, AddResult } from 'ipfs-core-types/root'
import type { IPFS } from 'ipfs-core-types'
import { CID } from 'multiformats'
import * as json from 'multiformats/codecs/json'
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
  conversations: { [key: Conversation['id']]: Conversation }
}

const initialState: State = {
  conversations: {},
}

export type Conversations = {
  [key: Conversation['id']]: ConversationMessage[]
}

export default class ChatManager extends Emitter<ConversationMessage> {
  public ready: boolean = false
  public state: State = {
    conversations: {},
  }

  public typingStatus: {
    [key: Conversation['id']]: { [key: string]: boolean }
  } = {}

  private _intervals: { [key: string]: any } = {}
  public subscriptions: {
    [key: string]: { topic: string; connected: boolean }
  } = {}

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    this.state = ((await this.get()) as State) ?? initialState
    const conversations = Object.values(this.state.conversations)
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize chat manager, no iridium connector')
    }
    // listen for sync node subscription responses
    iridium.p2p.on<
      IridiumPubsubMessage<IridiumDecodedPayload<SyncSubscriptionResponse>>
    >('node/message/sync/subscribe', this.onSyncSubscriptionResponse.bind(this))

    iridium.p2p.on<
      IridiumPubsubMessage<IridiumDecodedPayload<SyncFetchResponse>>
    >('node/message/sync/fetch', this.onSyncFetchResponse.bind(this))

    iridium.subscribe<IridiumConversationEvent>('/chat/announce', {
      handler: this.onConversationAnnounce.bind(this),
    })

    iridium.p2p.on('ready', async () => {
      if (!iridium.p2p.primaryNodeID) {
        throw new Error('not connected to primary node')
      }

      logger.info(
        'iridium/chatmanager/init',
        'p2p ready, initializing chat...',
        { node: iridium.p2p.primaryNodeID },
      )
      // sync fetch
      await iridium.p2p.send(iridium.p2p.primaryNodeID, {
        type: 'sync/fetch',
      })

      for (const conversation of conversations) {
        if (this.subscriptions[conversation.id] !== undefined) continue
        const topic = `/chat/conversations/${conversation.id}`
        this.subscriptions[conversation.id] = { topic, connected: false }

        logger.info(
          'iridium/chatmanager/init',
          `requesting sync subscription to ${topic}`,
        )
        // ask the sync node to subscribe to this topic
        await iridium.p2p.send(iridium.p2p.primaryNodeID, {
          type: 'sync/subscribe',
          topic,
          offlineSync: true,
        })
      }
      this.ready = true
      this.emit('ready', {})
    })
  }

  private async onConversationAnnounce(
    message: IridiumMessage<IridiumConversationEvent>,
  ) {
    const payload = message.payload.body

    const participants = payload.participants?.map((did) => did.toString())
    if (!participants) {
      return
    }

    await Promise.all(
      participants.map((did) => {
        if (!this.iridium.users.getUser(did)) {
          return this.iridium.users.searchPeer(did)
        }
        return null
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

  /**
   * @param message - pubsub message from the sync node
   * @description - handle a sync subscription response from the sync node
   */
  async onSyncSubscriptionResponse(
    message: IridiumPubsubMessage<
      IridiumDecodedPayload<SyncSubscriptionResponse>
    >,
  ) {
    logger.info(
      'iridium/chatmanager/onSyncSubscriptionResponse',
      'message received from sync node',
      message,
    )
    if (!message.payload.body.topic) {
      throw new Error('no topic in sync subscription response')
    }
    const [conversationId, subscription] =
      Object.entries(this.subscriptions).find(
        ([, { topic }]) => topic === message.payload.body.topic,
      ) || []

    if (!conversationId || !subscription) {
      return
    }
    if (subscription?.connected) {
      throw new Error('subscription already connected')
    }
    if (message.payload.body.success) {
      logger.info(
        'iridium/chatmanager/onSyncSubscriptionResponse',
        `sync node subscribed to ${message.payload.body.topic}`,
      )
      await this.iridium.connector?.subscribe(message.payload.body.topic, {
        handler: this.onConversationMessage.bind(this, conversationId),
      })
      subscription.connected = true
      this.subscriptions = {
        ...this.subscriptions,
        [conversationId]: {
          ...this.subscriptions[conversationId],
          connected: true,
        },
      }
      return
    }
    logger.warn(
      'iridium/chatmanager/onSyncSubscriptionResponse',
      'sync node failed to subscribe',
      message,
    )
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

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/chat${path}`, options)
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

      Vue.set(
        this.state.conversations[conversationId].message,
        message.id,
        message,
      )
      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )

      // Remove is_typing indicator upon user message receive
      clearTimeout(this.iridium.webRTC.timeoutMap[message.from])
      this.setTypingStatus(conversationId, message.from, false)

      const friendName = this.iridium.users.getUser(message?.from)
      if (!friendName) {
        return
      }
      const buildNotification: Partial<Notification> = {
        fromName: friendName?.name,
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
            : message.body,
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
      Vue.set(message.reactions, reaction.userId, reaction.reactions)
      await this.set(reactionsPath, reaction.reactions)
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
    id?: Conversation['id']
    type: Conversation['type']
    name: Conversation['name']
    participants: Conversation['participants']
  }): Promise<Conversation['id']> {
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
    }
    Vue.set(this.state.conversations, id, conversation)
    await this.set(`/conversations/${id}`, conversation)
    this.emit(`conversations/${id}`, conversation)

    // ask the sync node to subscribe to this topic
    this.subscriptions[conversation.id] = {
      topic: `/chat/conversations/${id}`,
      connected: false,
    }
    if (this.iridium.connector?.p2p.primaryNodeID) {
      await this.iridium.connector?.p2p.send(
        this.iridium.connector?.p2p.primaryNodeID,
        {
          type: 'sync/subscribe',
          topic: `/chat/conversations/${id}`,
          offlineSync: true,
        },
      )
    }

    return id
  }

  async createGroupConversation({
    name,
    participants,
  }: {
    name: Conversation['name']
    participants: Conversation['participants']
  }): Promise<Conversation['id']> {
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

  async deleteConversation(id: Conversation['id']) {
    if (!this.hasConversation(id)) {
      return
    }
    Vue.delete(this.state.conversations, id)
    this.set('/conversations', this.state.conversations)
    // todo - do we need to unsubscribe too?
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
    const message: Partial<ConversationMessage> = {
      ...payload,
      from: this.iridium.connector.id,
      reactions: {},
      attachments: payload.attachments,
    }
    message.id = (
      await this.iridium.connector.store(message, {
        syncPin: true,
        encrypt: { recipients: conversation.participants },
      })
    ).toString()

    if (!this.subscriptions[conversationId]) {
      // we're not subscribed yet
      throw new Error(`not yet subscribed to conversation ${conversationId}`)
    }

    Vue.set(
      this.state.conversations[conversationId].message,
      message.id,
      message,
    )
    await this.set(
      `/conversations/${conversationId}/message/${message.id}`,
      message,
    )

    // broadcast the message to connected peers
    await this.iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/message',
        cid: message.id,
      },
      {
        encrypt: { recipients: conversation.participants },
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

    if (!this.subscriptions[conversationId]) {
      // we're not subscribed yet
      throw new Error(`not yet subscribed to conversation ${conversationId}`)
    }

    const reactionsPath = `/conversations/${conversationId}/message/${messageId}/reactions/${did}`
    let reactions = (message.reactions && message.reactions[did]) ?? []

    const shouldRemove = reactions.includes(payload.reaction)
    if (shouldRemove) {
      reactions = reactions.filter((reaction) => reaction !== payload.reaction)
    } else {
      reactions.push(payload.reaction)
    }

    Vue.set(message.reactions, did, reactions)
    await this.set(reactionsPath, reactions)

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

  setTypingStatus(conversationId: string, did: string, value: boolean) {
    Vue.set(this.typingStatus, conversationId, {
      ...this.typingStatus[conversationId],
      [did]: value,
    })
  }
}
