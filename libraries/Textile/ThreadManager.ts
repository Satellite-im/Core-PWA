import {
  Client,
  Identity,
  PrivateKey,
  PublicKey,
  ThreadID,
  UserMessage,
} from '@textile/hub'
import { isRight } from 'fp-ts/Either'
import { Query } from '@textile/threads-client'
import { TextileInitializationData } from '~/types/textile/manager'
import {
  ConversationQuery,
  MailboxCallback,
  MailboxSubscriptionType,
  MessageCallback,
  MessageFromThread,
  MessagePayloads,
  MessageTypes,
} from '~/types/textile/mailbox'
import { messageEncoder } from '~/libraries/Textile/encoders'
import { Message, Messages } from '~/mock/messages'
import { EncodingTypesEnum } from '~/libraries/Enums/types/encoding-types'
import { PropCommonEnum } from '~/libraries/Enums/types/prop-common-events'
import { MessagingTypesEnum } from '~/libraries/Enums/types/messaging-types'

export default class ThreadManager {
  textile: TextileInitializationData
  senderAddress: string
  identity: Identity
  threadID: ThreadID
  token: string | null
  textileClient: Client
  mailboxID: string
  listeners: {
    inbox?: MailboxCallback
    sentbox?: MailboxCallback
  }

  constructor(
    textile: TextileInitializationData,
    senderAddress: string,
    identity: Identity,
  ) {
    this.identity = identity
    this.textile = textile
    this.senderAddress = senderAddress
    this.threadID = null
    this.token = null
    this.mailboxID = ''
    this.textileClient = textile.client
    this.identity = identity
    this.listeners = {}
  }

  async init() {
    if (!this.textileClient || !this.identity) {
      return new Error(
        'Attempted to interface with a thread before initializing',
      )
    }
    if (await this.ensureThread()) {
      const checkForCollection = await this.ensureCollection(
        'messageCollection',
      )
      if (checkForCollection) {
        await this.getCollection('messageCollection')
        const text = "whatever it says here doesn't matter"
        await this.sendMessage<'text'>('messageCollection', {
          to: 'messageCollection',
          payload: text,
          type: 'text',
        })
      }
      return
    }
    await this.createThread()
  }

  /**
   * @method
   * @name createThread
   * @argument threadUsers Users to create new thread with
   * @argument threadTitle Title of new thread
   * @argument options Object containing values to pass to textile
   */
  async createThread() {
    this.threadID = await this.textileClient.newDB(undefined, 'groupChats')
    await this.createNewChatCollection()
    return this.threadID
  }

  async createNewChatCollection() {
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Message',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        from: { type: 'string' },
        to: { type: 'string' },
        at: { type: 'number' },
        pinned: { type: 'boolean' },
        payload: { type: 'string' },
      },
    }
    await this.textileClient.newCollection(this.threadID, {
      name: 'messageCollection',
      schema,
    })
    const check = await this.textileClient.getCollectionInfo(
      this.threadID,
      'messageCollection',
    )
  }

  /**
   * @method
   * @name getCollection
   * @argument threadTitle identifier to retrieve the collection by
   * @argument options Object containing values to pass to textile
   */
  async getCollection(collectionName: string, options?: Object) {
    if (!this.textileClient || !this.identity)
      return new Error(
        'Attempted to interface with a thread before initializing',
      )
    return await this.textileClient.getCollectionInfo(
      this.threadID,
      collectionName,
    )
  }

  async ensureCollection(collectionName: string): Promise<boolean> {
    try {
      await this.getCollection('messageCollection')
      return true
    } catch (e) {
      await this.createNewChatCollection()
      return false
    }
  }

  /**
   * @method isInitialized
   * @description Checks if the mailbox is initialized for the current user
   * @returns true | false
   */
  isInitialized() {
    return this.mailboxID !== ''
  }

  async ensureThread(): Promise<boolean> {
    try {
      const thread = await this.textile.users.getThread('groupChats')
      this.threadID = ThreadID.fromString(thread.id)
      return true
    } catch (e) {
      await this.createThread()
      return false
    }
  }

  /**
   * @method
   * @name fetchThread
   * Fetch a thread ID from our storage method
   * @argument identifier identifier string of the thread to fetch
   * @returns string ID of the thread
   */
  async fetchThread(): Promise<ThreadID> {
    const thread = await this.textile.users.getThread('groupChats')
    return ThreadID.fromString(thread.id)
  }

  /**
   * @method getConversation
   * Retrieve a conversation with a specific user, filtered by the given query parameters
   * @param collectionName collection uuID
   * @param query parameters for filtering
   * @param lastInbound timestamp of last received message
   * @returns an array of messages
   */
  async getConversation({
    collectionName,
    query,
    lastInbound,
  }: {
    collectionName: string
    query: ConversationQuery
    lastInbound?: number
  }): Promise<Message[]> {
    const thread = await this.textile.users.getThread('hubmail')
    const threadID = ThreadID.fromString(thread.id)

    let inboxQuery = Query.where('from').eq(collectionName).orderByIDDesc()

    // if messages are stored in indexeddb, only fetch new messages from textile
    if (lastInbound) {
      lastInbound = lastInbound * 1000000 // textile has a more specific unix timestamp, matching theirs
      inboxQuery = Query.where('from')
        .eq(collectionName)
        .and(PropCommonEnum.MOD)
        .ge(lastInbound)
        .orderByIDDesc()
    }

    if (query?.limit) {
      inboxQuery.limitTo(query.limit)
    }

    if (query?.skip) {
      inboxQuery.skipNum(query.skip)
    }

    const encryptedInbox = await this.textile.client.find<MessageFromThread>(
      threadID,
      MailboxSubscriptionType.inbox,
      inboxQuery,
    )

    const lastMessageTime = encryptedInbox?.[0]?.created_at || 0
    const firstMessageTime =
      encryptedInbox?.[encryptedInbox.length - 1]?.created_at || 0

    const sentboxQuery = Query.where('to')
      .eq(collectionName)
      .and(PropCommonEnum.CREATED_AT)
      .ge(firstMessageTime)

    if (query?.skip && query.skip > 0) {
      sentboxQuery.and(PropCommonEnum.CREATED_AT).lt(lastMessageTime)
    }

    let encryptedSentbox: MessageFromThread[] = []

    // only fetch sent messages from textile if indexeddb is empty. after that, fetch sent messages from indexeddb
    if (lastInbound === undefined) {
      encryptedSentbox = await this.textile.client.find<MessageFromThread>(
        threadID,
        MailboxSubscriptionType.sentbox,
        sentboxQuery,
      )
    }

    const messages = [...encryptedInbox, ...encryptedSentbox].sort(
      (a, b) => a.created_at - b.created_at,
    )
    const promises = messages.map<Promise<Message>>(this.decodeMessage)

    const allSettled = await Promise.allSettled(promises)

    const filtered = allSettled.filter(
      (r) => r.status === PropCommonEnum.FULFILLED,
    ) as PromiseFulfilledResult<Message>[]
    return filtered.map((r) => r.value)
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given recipient
   * @param to Recipient
   * @param message Message to be sent
   */
  async sendMessage<T extends MessageTypes>(
    collectionName: string,
    message: MessagePayloads[T],
  ) {
    const recipient: PublicKey = PublicKey.fromString(collectionName)
    const encoder = new TextEncoder()
    const body = encoder.encode(
      JSON.stringify({
        from: this.senderAddress,
        to: collectionName,
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
        pack: message.pack,
      }),
    )

    const result = await this.textile.users.sendMessage(
      this.textile.identity,
      recipient,
      body,
    )
    console.log(result)

    return this.decodeMessage(userMessageToThread(result))
  }

  /**
   * @method decodeMessage
   * @description Internal function used to decode messages
   * @param message Message to be decoded
   */
  decodeMessage = async (message: MessageFromThread): Promise<Message> => {
    const identity: Identity = this.textile.identity
    const privKey = PrivateKey.fromString(identity.toString())

    // eslint-disable-next-line camelcase
    const { _id, from, read_at, created_at } = message

    // Body decryption and parse
    const msgBody = Buffer.from(message.body, EncodingTypesEnum.BASE64)
    const bytes = await privKey.decrypt(msgBody)
    const decoded = new TextDecoder().decode(bytes)
    try {
      const parsedBody = JSON.parse(decoded)
      const validation = messageEncoder.decode({
        ...parsedBody,
        id: _id,
        // eslint-disable-next-line camelcase
        at: Math.floor(created_at / 1000000), // Convert into unix timestamp
        from,
        // eslint-disable-next-line camelcase
        readAt: read_at,
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
   * @method buildCallback
   * Generates a MailboxCallback from MessageCallback and the unsubscribe function
   * @param onMessage the callback for the onMessage event
   * @param onUnsubscribe the event to be fired when the Textile subscription is closed
   * @returns the generated MailboxCallback
   */
  buildCallback(
    onMessage: MessageCallback,
    onUnsubscribe: CallableFunction,
  ): MailboxCallback {
    return (reply, err) => {
      // If the reply is undefined means that the subscription
      // has been closed by the Textile library
      if (reply === undefined && err === undefined) {
        onUnsubscribe()
        return
      }

      if (reply?.message) {
        this.decodeMessage(userMessageToThread(reply?.message)).then(
          (decrypted) => {
            onMessage(decrypted)
          },
        )
      }
    }
  }

  /**
   * @method listenToInboxMessages
   * @description Starts a watcher on inbox messages
   * @param onMessage Callback function to be called
   */
  listenToInboxMessages(onMessage: MessageCallback) {
    this.listeners.inbox = this.buildCallback(onMessage, () => {
      delete this.listeners.inbox
    })

    this.textile.users.watchInbox(this.mailboxID, this.listeners.inbox)
  }

  /**
   * @method listenToSentboxMessages
   * @description Starts a watcher on Sentbox messages
   * @param onMessage Callback function to be called
   */
  listenToSentboxMessages(onMessage: MessageCallback) {
    this.listeners.sentbox = this.buildCallback(onMessage, () => {
      delete this.listeners.sentbox
    })

    this.textile.users.watchSentbox(this.mailboxID, this.listeners.sentbox)
  }
}

/**
 * @function userMessageToThread
 * Converts the UserMessage type into its threadDB representation
 * @param message the user message to convert
 * @returns the converted message
 */
function userMessageToThread(message: UserMessage): MessageFromThread {
  const { body, createdAt, from, id, readAt, signature, to } = message
  return {
    _id: id,
    body: Buffer.from(body).toString(EncodingTypesEnum.BASE64),
    created_at: createdAt,
    read_at: readAt,
    _mod: createdAt,
    from,
    signature: Buffer.from(signature).toString(EncodingTypesEnum.BASE64),
    to,
  }
}
