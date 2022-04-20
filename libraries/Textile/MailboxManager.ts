import { Identity, PrivateKey, PublicKey } from '@textile/crypto'
import { Query } from '@textile/threads-client'
import { ThreadID } from '@textile/threads-id'
import { UserMessage, Users } from '@textile/users'
import { isRight } from 'fp-ts/lib/Either'
import { messageEncoder } from './encoders'
import {
  EncodingTypesEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import {
  ConversationQuery,
  MailboxCallback,
  MailboxSubscriptionType,
  Message,
  MessageCallback,
  MessageFromThread,
  MessagePayloads,
  MessageTypes,
} from '~/types/textile/mailbox'
import { TextileInitializationData } from '~/types/textile/manager'

export class MailboxManager {
  senderAddress: string
  textile: TextileInitializationData
  mailboxID: string
  listeners: {
    inbox?: MailboxCallback
    sentbox?: MailboxCallback
  }

  constructor(textile: TextileInitializationData, senderAddress: string) {
    this.textile = textile
    this.mailboxID = ''
    this.senderAddress = senderAddress
    this.listeners = {}
  }

  /**
   * @method init
   * @description Initializes the mailbox for the current user
   * @returns the mailbox id
   */
  async init(): Promise<string> {
    const users: Users = this.textile.users
    this.mailboxID = await users.setupMailbox()

    return this.mailboxID
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
    friendIdentifier,
    query,
    lastInbound,
  }: {
    friendIdentifier: string
    query: ConversationQuery
    lastInbound?: number
  }): Promise<Message[]> {
    const thread = await this.textile.users.getThread('hubmail')
    const threadID = ThreadID.fromString(thread.id)

    let inboxQuery = Query.where('from').eq(friendIdentifier).orderByIDDesc()

    // if messages are stored in indexeddb, only fetch new messages from textile
    if (lastInbound) {
      lastInbound = lastInbound * 1000000 // textile has a more specific unix timestamp, matching theirs
      inboxQuery = Query.where('from')
        .eq(friendIdentifier)
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
      .eq(friendIdentifier)
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

  /**
   * @method sendMessage
   * @description Sends a message to the given recipient
   * @param to Recipient
   * @param message Message to be sent
   */
  async sendMessage<T extends MessageTypes>(
    to: string,
    message: MessagePayloads[T],
  ) {
    const recipient: PublicKey = PublicKey.fromString(to)
    const encoder = new TextEncoder()
    const body = encoder.encode(
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

    const result = await this.textile.users.sendMessage(
      this.textile.identity,
      recipient,
      body,
    )

    return this.decodeMessage(userMessageToThread(result))
  }

  /**
   * @method editMessage
   * @description Edits a message to the given recipient
   * @param id Message id
   * @param message Message to be sent
   */
  async editMessage<T extends MessageTypes>(
    id: string,
    message: MessagePayloads[T],
  ) {
    const identity = this.textile.identity
    const publicKey = PublicKey.fromString(identity.public.toString())
    const encoder = new TextEncoder()
    const encodedBody = encoder.encode(
      JSON.stringify({
        from: this.senderAddress,
        to: message.to,
        at: Date.now(),
        editedAt: Date.now(),
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
      }),
    )

    const body = Buffer.from(await publicKey.encrypt(encodedBody)).toString(
      EncodingTypesEnum.BASE64,
    )
    const signature = Buffer.from(await identity.sign(encodedBody)).toString(
      EncodingTypesEnum.BASE64,
    )

    const thread = await this.textile.users.getThread('hubmail')
    const threadID = ThreadID.fromString(thread.id)

    const records = await this.textile.client.find<MessageFromThread>(
      threadID,
      MailboxSubscriptionType.sentbox,
      Query.where('_id').eq(id),
    )
    if (records.length > 0) {
      const [record] = records
      record.body = body
      record.signature = signature
      delete record._mod
      await this.textile.client.save(
        threadID,
        MailboxSubscriptionType.sentbox,
        [record],
      )
      return this.decodeMessage(record)
    }
    return false
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
   * @method isInitialized
   * @description Checks if the mailbox is initialized for the current user
   * @returns true | false
   */
  isInitialized() {
    return this.mailboxID !== ''
  }

  /**
   * @method isSubscribed
   * @description Checks if the subscription for the given type is active
   * @param type Subscription type 'inbox' | 'sentbox'
   * @returns true | false
   */
  isSubscribed(type: MailboxSubscriptionType): boolean {
    return Boolean(this.listeners[type])
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
