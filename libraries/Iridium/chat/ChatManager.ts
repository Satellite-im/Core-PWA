import Vue from 'vue'
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
import { CID } from 'multiformats'
import { sha256 } from 'multiformats/hashes/sha2'
import * as json from 'multiformats/codecs/json'
import type { EmitterCallback } from '@satellite-im/iridium'
import type { SyncFetchResponse } from '@satellite-im/iridium/src/sync/types'
import { v4 } from 'uuid'
import {
  ChatError,
  Conversation,
  ConversationMessagePayload,
  ConversationMessage,
  IridiumConversationEvent,
  MessageAttachment,
  MessageEdit,
  MessageEditPayload,
  MessageReaction,
  MessageReactionPayload,
  ConversationType,
} from '~/libraries/Iridium/chat/types'
import { Friend } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { ChatFileUpload } from '~/store/chat/types'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import isNSFW from '~/utilities/NSFW'
import {
  GroupConversationCreatedNotificationPayload,
  MemberJoinNotificationPayload,
  MessageNotificationPayload,
  NotificationBase,
  NotificationPayloads,
  NotificationType,
} from '~/libraries/Iridium/notifications/types'
import { uploadFile } from '~/libraries/Iridium/utils'
import { truthy } from '~/utilities/typeGuard'

export type ConversationPubsubEvent = IridiumMessage<
  IridiumDecodedPayload<{
    message?: ConversationMessage | MessageEdit
    cid?: string
    type: 'chat/message' | 'chat/reaction' | 'chat/edit'
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
  public ephemeral: {
    typing: { [key: Conversation['id']]: string[] | undefined }
    subscriptions: Conversation['id'][]
    conversations: { [key: string]: ConversationMessage[] | undefined }
    activeConversationId: Conversation['id'] | undefined
    startedAt: number
  } = {
    typing: {},
    subscriptions: [],
    conversations: {},
    activeConversationId: '',
    startedAt: 0,
  }

  private logPrefix = 'iridium/ChatManager'

  async start() {
    this.ephemeral.startedAt = Date.now().valueOf()
    const fetched = await this.get<State>()
    this.state.conversations = {
      ...this.state.conversations,
      ...(fetched?.conversations || {}),
    }
    const conversations = Object.values(this.state.conversations)
    iridium.connector?.p2p.on<
      IridiumPubsubMessage<IridiumDecodedPayload<SyncFetchResponse>>
    >('node/message/sync/fetch', this.onSyncFetchResponse.bind(this))

    iridium.connector?.subscribe<
      IridiumPubsubMessage<IridiumDecodedPayload<IridiumConversationEvent>>
    >('/chat/announce', {
      handler: this.onConversationAnnounce.bind(this),
    })

    await Promise.all(
      conversations.map(async (conversation) => {
        await this.listenToConversation(conversation.id)
      }),
    )

    iridium.sendSyncFetch()
    this.ready = true
    this.emit('ready', {})
  }

  async stop() {}

  private async listenToConversation(conversationId: string) {
    const topic = `/chat/conversations/${conversationId}`
    logger.info(
      `${this.logPrefix}/start`,
      `requesting sync subscription to ${topic}`,
    )
    // ask the sync node to subscribe to this topic
    await iridium.connector?.subscribe<ConversationPubsubEvent>(topic, {
      sync: {
        offline: true,
      },
      handler: this.onConversationMessage.bind(this, conversationId),
    })
    this.ephemeral.subscriptions.push(conversationId)
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
      participants
        .filter((did) => !iridium.users.getUser(did))
        .map((did) => iridium.users.searchPeer(did, { andSave: true })),
    )

    if (payload.type === 'create' || payload.type === 'added_to_group') {
      await this.createConversation({
        id: payload.id,
        type: 'group',
        name: payload.name,
        participants,
      })

      const notificationType =
        payload.type === 'create'
          ? NotificationType.GROUP_CONVERSATION_CREATED
          : NotificationType.ADDED_TO_GROUP

      // send browser notification to notify user of new group conversation
      const notification: NotificationBase<GroupConversationCreatedNotificationPayload> =
        {
          type: notificationType,
          senderId: message.from,
          at: Date.now().valueOf(),
          seen: false,
          payload: {
            conversationId: payload.id,
          },
        }
      iridium.notifications.emit('notification/create', notification)
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

    // read msg infos in order
    const msgs = await Promise.all(
      message.payload.body.messages
        .sort((a, b) => a.createdAt - b.createdAt)
        .map(async (message) => {
          const stored = await iridium.connector?.dag.get(
            CID.parse(message.cid),
          )
          if (!stored?.body) {
            return
          }
          const buffer = await iridium.connector?.did.decryptJWE(stored.body)
          const payload: any = buffer && json.decode(buffer)

          return { stored, payload }
        }),
    )

    // then emit the msgs
    msgs.forEach((msg) => {
      if (!msg) return

      const { stored, payload } = msg
      if (stored.topic) {
        logger.info(
          `${this.logPrefix}/onSyncFetchResponse`,
          'sync/fetch/message - emitting synced message',
          payload,
        )
        iridium.connector?.pubsub.emit(stored.topic, {
          from: stored.from,
          topic: stored.topic,
          payload: { type: 'jwe', body: payload },
        })
      }
    })

    logger.info(
      `${this.logPrefix}/onSyncFetchResponse`,
      'sync/fetch/messages - sending delivery receipt',
      message.payload.body.messages,
    )
    // let the sync node know we've stored these messages
    iridium.connector?.p2p.send(iridium.connector?.p2p.primaryNodeID, {
      type: 'sync/delivered',
      messages: message.payload.body.messages?.map(
        (message: { cid: string }) => message.cid,
      ),
    })
    logger.info(
      `${this.logPrefix}/onSyncFetchResponse`,
      'sync/fetch/messages - done',
    )
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

    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    const { type, cid } = payload.body
    if (type === 'chat/message') {
      let message: ConversationMessage
      if (payload.body.message) {
        message = payload.body.message as ConversationMessage
      } else {
        throw new Error('no message in payload')
      }

      message.attachments.forEach((attachment) => {
        if (!iridium.connector?.p2p.primaryNodeID) {
          return
        }
        iridium.connector?.p2p.send(iridium.connector?.p2p.primaryNodeID, {
          cid: attachment.cid,
          type: 'sync/validate',
        })
      })
      logger.info(
        `${this.logPrefix}/onConversationMessage`,
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
      this.setTyping(conversationId, fromDID, false)

      const receivedWhileOffline = this.ephemeral.startedAt > message.at
      if (
        (!document.hasFocus() || !this.isActive(conversationId)) &&
        !receivedWhileOffline
      ) {
        this.sendNotification(message, conversation)
      }
    } else if (type === 'chat/reaction') {
      const reaction = payload.body.reaction
      logger.info(`${this.logPrefix}/onConversationMessage`, 'reaction', {
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

      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )
    } else if (type === 'chat/edit') {
      if (!payload?.body?.message) {
        console.error('no message in payload')
        return
      }
      const { messageId, conversationId, body, lastEditedAt } = payload.body
        .message as MessageEdit

      logger.info(`${this.logPrefix}/onConversationMessage`, 'message edit', {
        from,
        conversationId,
      })
      const message = this.getConversationMessage(conversationId, messageId)
      message.body = body
      message.lastEditedAt = lastEditedAt

      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )
    }
  }

  isActive(conversationId: string) {
    return this.ephemeral.activeConversationId === conversationId
  }

  // TODO: refactor and remove the need for this
  private getNotificationType(
    message: ConversationMessage,
    conversationType: ConversationType,
  ): NotificationType {
    switch (message.type) {
      case 'member_join': {
        if (message.members?.includes(iridium.id)) {
          return NotificationType.ADDED_TO_GROUP
        }
        return NotificationType.MEMBER_JOIN
      }
      case 'member_leave': {
        return NotificationType.MEMBER_LEAVE
      }
      case 'call': {
        return NotificationType.CALL_INCOMING
      }
    }
    switch (conversationType) {
      case 'group':
        return NotificationType.GROUP_MESSAGE
      case 'direct':
        return NotificationType.DIRECT_MESSAGE
    }
  }

  getNotificationPayload = (
    conversation: Conversation,
    message: ConversationMessage,
  ): NotificationPayloads | undefined => {
    const notificationType = this.getNotificationType(
      message,
      conversation.type,
    )

    const notificationPayload: NotificationPayloads = {
      messageId: message.id,
      conversationId: conversation.id,
    }

    if (message.members) {
      return {
        ...notificationPayload,
        addedMemberIds: message.members,
      }
    }

    return notificationPayload
  }

  private sendNotification(
    message: ConversationMessage,
    conversation: Conversation,
  ) {
    const isGroup = conversation.type === 'group'

    const notificationType = this.getNotificationType(
      message,
      conversation.type,
    )

    if (!notificationType) {
      return
    }

    const notificationPayload = this.getNotificationPayload(
      conversation,
      message,
    )

    iridium.notifications.emit('notification/create', {
      type: notificationType,
      senderId: message.from,
      image: message.from,
      payload: notificationPayload,
    } as NotificationBase<MessageNotificationPayload | MemberJoinNotificationPayload>)
  }

  hasConversation(id: string) {
    return Object.keys(this.state.conversations).includes(id)
  }

  async hasDirectConversation(did: string) {
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
    if (friendDid === iridium.id) {
      return
    }
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
    Vue.set(this.state.conversations, id, conversation)
    await this.set(`/conversations/${id}`, conversation)
    this.emit(`conversations/${id}`, conversation)

    this.listenToConversation(id)
    iridium.sendSyncFetch()

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
    Vue.set(this.state.conversations, conversationId, conversation)
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

    // notify the new members of the conversation
    event = {
      id,
      type: 'added_to_group',
      name: conversation.name,
      participants: conversation.participants,
    }

    await iridium.connector.publish('/chat/announce', event, {
      encrypt: {
        recipients: newMembers,
      },
    })

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

    this.emit('routeCheck', id)

    // send a message in the conversation
    await this.sendMessage({
      conversationId: id,
      type: 'member_leave',
      at: Date.now(),
      attachments: [],
      payload: {},
    })

    const participants = [iridium.id]
    const event: IridiumConversationEvent = {
      id,
      type: 'remove_member',
      participants,
    }

    await iridium.connector.publish('/chat/announce', event, {
      encrypt: {
        recipients: conversation.participants,
      },
    })

    // remove users unless they are my friends or they are in one of my groups
    // (check all users in the userManager because there is the case of groups with people not in participants but still in the userManager list, for example when they left the group)
    await Promise.all(
      iridium.users.list
        .filter(truthy)
        .filter(
          (u) =>
            !participants.includes(u.did) &&
            !iridium.friends.isFriend(u.did) &&
            !this.isUserInOtherGroups(u.did, [id]),
        )
        .map(async (u) => {
          await iridium.users.userRemove(u.did, true)
        }),
    )
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
    Vue.delete(this.state.conversations, id)
    this.set('/conversations', this.state.conversations)
    await iridium.connector?.unsubscribe(`/chat/conversations/${id}`)
    const index = this.ephemeral.subscriptions.indexOf(id)
    if (index > -1) {
      this.ephemeral.subscriptions.splice(index, 1)
    }
  }

  getConversation(id: Conversation['id']): Conversation {
    const conversation = this.state.conversations[id]
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    return conversation
  }

  getConversationMessage(
    conversationId: string,
    messageId: string,
  ): ConversationMessage {
    const conversation = this.getConversation(conversationId)
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

  async addFile({
    upload,
    conversationId,
  }: {
    upload: ChatFileUpload
    conversationId: string
  }): Promise<MessageAttachment | null> {
    const conversation = this.getConversation(conversationId)
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }

    const safer = await uploadFile(upload.file, conversation.participants)
    if (!safer || !safer.valid) {
      logger.error(`${this.logPrefix}/addFile`, 'file content is not valid')
      return null
    }

    const syncPinResult = await iridium.connector?.fileLoad(safer.cid)
    return {
      cid: syncPinResult.cid,
      name: upload.file.name,
      size: upload.file.size,
      nsfw: await isNSFW(upload.file),
      type: Object.values(FILE_TYPE).includes(upload.file.type as FILE_TYPE)
        ? (upload.file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
    }
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

    const bytes = json.encode(partial)
    const payloadHash = await sha256.digest(bytes)
    const tempCid = CID.create(1, json.code, payloadHash)
    const message: ConversationMessage = {
      ...partial,
      id: tempCid.toString() as string,
    }

    const ephMsg: ConversationMessage = {
      ...message,
      status: 'pending',
    }

    this.setEphemeralConversation(conversationId, ephMsg)

    try {
      await Promise.all([
        iridium.connector?.store(partial, {
          syncPin: true,
          encrypt: conversation?.participants
            ? { recipients: conversation?.participants }
            : undefined,
        }),
        iridium.connector?.publish(
          `/chat/conversations/${conversationId}`,
          {
            type: 'chat/message',
            cid: tempCid.toString() as string,
            message,
          },
          {
            encrypt: conversation?.participants
              ? { recipients: conversation.participants }
              : undefined,
          },
        ),
      ])
    } catch (error) {
      this.setEphemeralConversation(conversationId, {
        ...ephMsg,
        status: 'failed',
      })
      return
    }

    this.setEphemeralConversation(conversationId, ephMsg, true)

    Vue.set(
      this.state.conversations[conversationId].message,
      message.id,
      message,
    )
    Vue.set(this.state.conversations[conversationId], 'lastReadAt', Date.now())

    this.set(
      `/conversations/${conversationId}`,
      this.state.conversations[conversationId],
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

    Vue.set(message.reactions, did, reactions)
    const path = `/conversations/${conversationId}/message/${messageId}`
    this.set(path, message)

    const conversation = this.getConversation(conversationId)
    const reaction: MessageReaction = {
      conversationId,
      messageId,
      userId: did,
      reactions,
    }
    // broadcast the message to connected peers
    await iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/reaction',
        reaction,
      },
      {
        encrypt: conversation?.participants
          ? { recipients: conversation.participants }
          : undefined,
      },
    )
  }

  async editMessage(payload: MessageEditPayload) {
    if (!iridium.connector) {
      return
    }

    const { conversationId, messageId, body } = payload
    const message = this.getConversationMessage(conversationId, messageId)

    message.body = body
    message.lastEditedAt = Date.now()
    const path = `/conversations/${conversationId}/message/${messageId}`
    this.set(path, message)

    const conversation = this.getConversation(conversationId)
    const finalMessage: MessageEdit = {
      conversationId,
      messageId,
      body,
      lastEditedAt: message.lastEditedAt,
    }
    // broadcast the message to connected peers
    await iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/edit',
        message: finalMessage,
      },
      {
        encrypt: conversation?.participants
          ? { recipients: conversation.participants }
          : undefined,
      },
    )
  }

  setTyping(conversationId: string, did: string, typing: boolean) {
    const typingList = this.ephemeral.typing[conversationId]

    if (typing) {
      if (!typingList) {
        Vue.set(this.ephemeral.typing, conversationId, [did])
        return
      }

      if (typingList.includes(did)) return

      typingList.push(did)
    } else if (typingList) {
      const index = typingList.indexOf(did)
      if (index >= 0) typingList.splice(index, 1)
    }
  }

  setEphemeralConversation(
    conversationId: string,
    message: ConversationMessage,
    remove: boolean = false,
  ) {
    const conversationMessages = this.ephemeral.conversations[conversationId]
    if (!remove) {
      if (!conversationMessages) {
        Vue.set(this.ephemeral.conversations, conversationId, [message])
        return
      }
      const index = conversationMessages.findIndex(
        (msg) => msg.id === message.id,
      )
      if (index === -1) conversationMessages.push(message)
      else conversationMessages.splice(index, 1, message)
      return
    }

    const index = conversationMessages?.findIndex(
      (msg) => msg.id === message.id,
    )
    if (index !== undefined && index >= 0)
      conversationMessages?.splice(index, 1)
  }

  // Check if user is in other groups other than `exlude` groups.
  // `messageCond` is true when checking if a user has sent some messages in some groups (there is the case where the user left a group but we need to keep it in userManager state)
  // `messageCond` is false when we do not want to announce events to users not in a participants array
  isUserInOtherGroups(did: string, exclude: string[] = [], messageCond = true) {
    return Object.values(this.state.conversations)
      .filter((c) => c.type === 'group' && !exclude.includes(c.id))
      .some(
        (c) =>
          c.participants.includes(did) ||
          (messageCond && Object.values(c.message).some((m) => m.from === did)),
      )
  }
}
