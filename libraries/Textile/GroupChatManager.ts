import { Identity, PublicKey } from '@textile/crypto'
import { Query, Update } from '@textile/threads-client'
import { ThreadID } from '@textile/threads-id'
import { isRight } from 'fp-ts/lib/Either'
import { v4 as uuid } from 'uuid'
import Vue from 'vue'
import { messageEncoder } from './encoders'
import Crypto from '~/libraries/Crypto/Crypto'
import {
  EncodingTypesEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { groupChatSchema } from '~/libraries/Textile/schema'
import { AccountsError } from '~/store/accounts/types'
import {
  ConversationQuery,
  MailboxSubscriptionType,
  Message,
  MessageCallback,
  MessageFromThread,
  MessagePayloads,
  MessageTypes,
} from '~/types/textile/mailbox'
import { TextileInitializationData } from '~/types/textile/manager'

export class GroupChatManager {
  private _threadID?: ThreadID
  senderAddress: string
  textile: TextileInitializationData
  identity: Identity
  listeners: {
    message: {
      [id: string]: (reply?: Update<any>, err?: Error) => void
    }
  }

  constructor(
    textile: TextileInitializationData,
    senderAddress: string,
    identity: Identity,
  ) {
    this.identity = identity
    this.textile = textile
    this.senderAddress = senderAddress
    this.listeners = {
      message: {},
    }
  }

  get threadID() {
    if (!this._threadID) {
      throw new Error('GroupChatManager not initialized')
    }
    return this._threadID
  }

  async init() {
    this._threadID = await this.getThreadID()
  }

  /**
   * @method createGroupConversation
   * Create a conversation with specific users
   * @returns a string UUID of the created groupChat
   */
  async createGroupConversation(): Promise<string> {
    const newCollectionUUID = uuid()
    await this.textile.client.newCollection(this.threadID, {
      name: newCollectionUUID,
      schema: groupChatSchema,
    })
    return `${this.threadID}|${newCollectionUUID}`
  }

  async getThreadName(): Promise<string> {
    const crypto = new Crypto()
    const name = crypto.signMessageWithKey(
      Buffer.from(this.textile.wallet.privateKey),
      `groupChats`,
    )

    return crypto.hash(name)
  }

  async getThreadID(): Promise<ThreadID> {
    const name = await this.getThreadName()
    try {
      const thread = await this.textile.client.getThread(name)
      return ThreadID.fromString(thread.id)
    } catch (e) {
      return await this.textile.client.newDB(undefined, name)
    }
  }

  /**
   * @method getConversation
   * Retrieve a conversation with a specific user, filtered by the given query parameters
   * @param friendIdentifier friend mailboxId
   * @param query parameters for filtering
   * @param lastInbound timestamp of last received message
   * @returns an array of messages
   */
  async getConversation({
    group,
    query,
    lastInbound,
  }: {
    group: { id: string; encryptionKey: string }
    query: ConversationQuery
    lastInbound?: number
  }): Promise<Message[]> {
    const { threadID, collectionName } = this.decodeGroupID(group.id)

    let groupChatQuery = Query.where('to').eq(group.id).orderByIDDesc()

    // if messages are stored in indexeddb, only fetch new messages from textile
    if (lastInbound) {
      lastInbound = lastInbound * 1000000 // textile has a more specific unix timestamp, matching theirs
      groupChatQuery = Query.where('to')
        .eq(group.id)
        .and(PropCommonEnum.MOD)
        .ge(lastInbound)
        .orderByIDDesc()
    }

    if (query?.limit) {
      groupChatQuery.limitTo(query.limit)
    }

    if (query?.skip) {
      groupChatQuery.skipNum(query.skip)
    }

    const messages = await this.textile.client.find<MessageFromThread>(
      threadID,
      collectionName,
      groupChatQuery,
    )

    const promises = messages.map<Promise<Message>>((message) =>
      this.decodeMessage(message, group.encryptionKey),
    )
    const allSettled = await Promise.allSettled(promises)
    const filtered = allSettled.filter(
      (r) => r.status === PropCommonEnum.FULFILLED,
    ) as PromiseFulfilledResult<Message>[]

    return filtered.map((r) => r.value)
  }

  /**
   * @method listenToGroupMessages
   * @description Starts a watcher on inbox messages
   * @param onMessage Callback function to be called
   * @param group
   */
  async listenToGroupMessages(
    onMessage: MessageCallback,
    group: { id: string; encryptionKey: string },
  ) {
    this.listeners.message[group.id] = (
      update?: Update<MessageFromThread>,
      err?: any,
    ) => {
      if (update === undefined && err === undefined) {
        delete this.listeners.message[group.id]
        return
      }

      if (update?.instance) {
        this.decodeMessage(update.instance, group.encryptionKey).then(
          (decoded) => {
            onMessage(decoded)
          },
        )
      }
    }
    const { threadID, collectionName } = this.decodeGroupID(group.id)
    await this.textile.client.listen(
      threadID,
      [{ collectionName }],
      this.listeners.message[group.id],
    )
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given groupChat
   * @param group
   * @param message Message to be sent
   */
  async sendMessage<T extends MessageTypes>(
    group: { id: string; encryptionKey: string },
    message: MessagePayloads[T],
  ) {
    const { threadID, collectionName } = this.decodeGroupID(group.id)
    const identity = this.textile.identity
    const $Crypto: Crypto = Vue.prototype.$Crypto
    const publicKey = PublicKey.fromString(identity.public.toString())
    const encoder = new TextEncoder()
    const encodedBody = encoder.encode(
      JSON.stringify({
        from: this.senderAddress,
        to: message.to,
        at: Date.now(),
        type: message.type,
        payload: message.payload,
        reactedTo:
          message.type === MessagingTypesEnum.REACTION
            ? message.reactedTo
            : undefined,
        repliedTo:
          message.type === MessagingTypesEnum.REPLY
            ? message.repliedTo
            : undefined,
        replyType:
          message.type === MessagingTypesEnum.REPLY
            ? message.replyType
            : undefined,
        pack:
          message.type === MessagingTypesEnum.GLYPH ? message.pack : undefined,
      }),
    )

    const body = Buffer.from(encodedBody).toString(EncodingTypesEnum.BASE64)

    const encryptedMessage = await $Crypto.encryptWithPassword(
      body,
      group.encryptionKey,
    )

    const signature = Buffer.from(await identity.sign(encodedBody)).toString(
      EncodingTypesEnum.BASE64,
    )
    const messageToSend = {
      created_at: Date.now(),
      from: publicKey.toString(),
      body: encryptedMessage,
      signature,
      to: message.to,
      _mod: Date.now(),
    }

    const messageID = await this.textile.client.create(
      threadID,
      collectionName,
      [messageToSend],
    )
    return this.decodeMessage(
      { ...messageToSend, _id: messageID[0] },
      group.encryptionKey,
    )
  }

  /**
   * @method decodeMessage
   * @description Internal function used to decode messages
   * @param message Message to be decoded
   * @param groupChatId
   * @param groupEncryption
   */
  async decodeMessage(
    message: MessageFromThread,
    groupEncryption: string,
  ): Promise<Message> {
    // eslint-disable-next-line camelcase
    const { _id, from, read_at, created_at, body } = message
    const decryptedBody = await this.decryptGroupMessage(body, groupEncryption)
    const msgBody = Buffer.from(decryptedBody, EncodingTypesEnum.BASE64)
    const decoded = new TextDecoder().decode(msgBody)
    try {
      const parsedBody = JSON.parse(decoded)

      const validation = messageEncoder.decode({
        ...parsedBody,
        id: _id,
        at: created_at, // eslint-disable-line camelcase
        from,
        readAt: read_at, // eslint-disable-line camelcase
        sender: parsedBody.from,
      })
      if (!isRight(validation)) {
        throw new Error('Invalid message payload')
      }

      return validation.right
    } catch (_) {
      throw new Error('Invalid message payload')
    }
  }

  /**
   * @method isInitialized
   * @description Checks if the mailbox is initialized for the current user
   * @returns true | false
   */
  isInitialized() {
    return Boolean(this._threadID)
  }

  /**
   * @method decryptGroup
   * @description Decrypts the message from a groups encryptionKey
   * @returns decryptedBody string
   */
  async decryptGroupMessage(
    body: string,
    groupPassword: string,
  ): Promise<string> {
    const $Crypto: Crypto = Vue.prototype.$Crypto
    const decryptedBody = await $Crypto.decryptWithPassword(body, groupPassword)
    if (!decryptedBody) {
      throw new Error(AccountsError.INVALID_PIN)
    }
    return decryptedBody
  }

  /**
   * Helper method to extract threadID and collectionName from group id string
   * @param input {string} group id
   */
  decodeGroupID(input: string): {
    threadID: ThreadID
    collectionName: string
  } {
    const [thread, collection] = input.split('|')

    if (!thread || !collection) throw new Error('Unable to decode group id')

    return {
      threadID: ThreadID.fromString(thread),
      collectionName: collection,
    }
  }

  isSubscribed(id: string): boolean {
    return !!this.listeners.message?.[id]
  }

  /**
   * Get time of last message from group conversation
   * @param id {string} group id
   * @returns {number} timestamp of last group message or 0 if no message found
   */
  async getGroupLastUpdate(id: string): Promise<number> {
    const { threadID, collectionName } = this.decodeGroupID(id)
    const query = new Query().orderByDesc(PropCommonEnum.MOD).limitTo(1)
    const [message] = await this.textile.client.find<MessageFromThread>(
      threadID,
      collectionName,
      query,
    )

    return message?.created_at || 0
  }
}
