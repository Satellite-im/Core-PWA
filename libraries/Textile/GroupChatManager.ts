import { PublicKey, ThreadID, Update } from '@textile/hub'
import { Query } from '@textile/threads-client'
import { isRight } from 'fp-ts/lib/Either'
import { v4 as uuid } from 'uuid'
import { messageEncoder } from './encoders'
import {
  ConversationQuery,
  Message,
  MessageCallback,
  MessageFromThread,
  MessagePayloads,
  MessageTypes,
} from '~/types/textile/mailbox'
import { TextileInitializationData } from '~/types/textile/manager'
import {
  EncodingTypesEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { groupChatSchema } from '~/libraries/Textile/schema'

export class GroupChatManager {
  senderAddress: string
  textile: TextileInitializationData
  threadID: ThreadID
  listeners: {
    message?: (reply?: Update<any> | undefined, err?: Error | undefined) => void
  }

  constructor(textile: TextileInitializationData, senderAddress: string) {
    this.textile = textile
    this.senderAddress = senderAddress
    this.threadID = ThreadID.fromString(Config.textile.groupChatThreadID)
    this.listeners = {}
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
    return newCollectionUUID
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
    groupChatID,
    query,
    lastInbound,
  }: {
    groupChatID: string
    query: ConversationQuery
    lastInbound?: number
  }): Promise<Message[]> {
    let groupChatQuery = Query.where('to').eq(groupChatID).orderByIDDesc()

    // if messages are stored in indexeddb, only fetch new messages from textile
    if (lastInbound) {
      lastInbound = lastInbound * 1000000 // textile has a more specific unix timestamp, matching theirs
      groupChatQuery = Query.where('to')
        .eq(groupChatID)
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
      this.threadID,
      groupChatID,
      groupChatQuery,
    )
    const promises = messages.map<Promise<Message>>(this.decodeMessage)
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
   * @param groupChatId
   */
  async listenToGroupMessages(onMessage: MessageCallback, groupChatId: string) {
    this.listeners.message = (
      update?: Update<MessageFromThread>,
      err?: any,
    ) => {
      if (update === undefined && err === undefined) {
        delete this.listeners.message
        return
      }

      if (update?.instance) {
        this.decodeMessage(update?.instance).then((decoded) => {
          onMessage(decoded)
        })
      }
    }

    await this.textile.client.listen(
      this.threadID,
      [{ collectionName: groupChatId }],
      this.listeners.message,
    )
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given groupChat
   * @param message Message to be sent
   * @param groupChatID
   */
  async sendMessage<T extends MessageTypes>(message: MessagePayloads[T]) {
    const identity = this.textile.identity
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

    const signature = Buffer.from(await identity.sign(encodedBody)).toString(
      EncodingTypesEnum.BASE64,
    )

    const messageToSend = {
      created_at: Date.now(),
      from: publicKey.toString(),
      body,
      signature,
      to: message.to,
      _mod: Date.now(),
    }

    const messageID = await this.textile.client.create(
      this.threadID,
      message.to,
      [messageToSend],
    )

    return this.decodeMessage({ ...messageToSend, _id: messageID[0] })
  }

  /**
   * @method decodeMessage
   * @description Internal function used to decode messages
   * @param message Message to be decoded
   */
  decodeMessage = async (message: MessageFromThread): Promise<Message> => {
    // eslint-disable-next-line camelcase
    const { _id, from, read_at, created_at, body } = message

    // Body decryption and parse
    const msgBody = Buffer.from(body, EncodingTypesEnum.BASE64)
    const decoded = new TextDecoder().decode(msgBody)

    try {
      const parsedBody = JSON.parse(decoded)
      const validation = messageEncoder.decode({
        ...parsedBody,
        id: _id,
        at: created_at, // eslint-disable-line camelcase
        from,
        readAt: read_at, // eslint-disable-line camelcase
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
    return Boolean(this.threadID)
  }
}
