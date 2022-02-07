import {
  Identity,
  PrivateKey,
  PublicKey,
  ThreadID,
  Update,
  UserMessage,
  Users,
} from '@textile/hub'
import { Query } from '@textile/threads-client'
import { isRight } from 'fp-ts/lib/Either'
import { v4 as uuid } from 'uuid'
import { messageEncoder } from './encoders'
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
  mailboxID: string
  threadID: ThreadID
  listeners: {
    message?: (reply?: Update<any> | undefined, err?: Error | undefined) => void
  }

  constructor(textile: TextileInitializationData, senderAddress: string) {
    this.textile = textile
    this.mailboxID = ''
    this.senderAddress = senderAddress
    this.threadID = ThreadID.fromString(Config.textile.groupChatThreadID)

    this.listeners = {}
  }

  /**
   * @method init
   * @description Initializes the mailbox for the current user
   * @returns the mailbox id
   */
  async init(): Promise<ThreadID> {
    const users: Users = this.textile.users
    this.mailboxID = await users.setupMailbox()
    return (this.threadID = ThreadID.fromString(
      Config.textile.groupChatThreadID,
    ))
  }

  /**
   * @method createGroupConversation
   * Create a conversation with specific users
   * @param friendIdentifiers friends mailboxId's
   * @returns a string UUID of the created groupChat
   */
  async createGroupConversation(
    threadID: ThreadID,
    // friendIdentifiers: Array<string>,
  ): Promise<string> {
    const newCollectionUUID = uuid()
    await this.textile.client.newCollection(threadID, {
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
  }): Promise<MessageFromThread[]> {
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

    const groupMessagesInbox =
      await this.textile.client.find<MessageFromThread>(
        this.threadID,
        groupChatID,
        groupChatQuery,
      )
    const messages = [...groupMessagesInbox].sort(
      (a, b) => a.created_at - b.created_at,
    )
    const promises = messages.map<Promise<Message>>(this.decodeMessage)

    const allSettled = await Promise.allSettled(promises)
    console.log(promises, allSettled, messages)
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
    this.listeners.message = (update?: Update<UserMessage>, err?: any) => {
      if (update === undefined && err === undefined) {
        delete this.listeners.message
        return
      }

      if (update?.instance) {
        console.log('message from listener', update?.instance)
        // this.decodeMessage(update?.instance).then((decrypted) => {
        //   onMessage(decrypted)
        // })
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
        body: message.payload,
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

    const messageToSend: MessageFromThread = {
      _id: '',
      created_at: Date.now(),
      from: publicKey.toString(),
      body,
      signature,
      to: message.to,
      _mod: Date.now(),
      read_at: undefined,
    }

    const messageID = await this.textile.client.create(
      this.threadID,
      message.to,
      [
        {
          _id: null,
          created_at: Date.now(),
          from: publicKey.toString(),
          body,
          signature,
          to: message.to,
          _mod: Date.now(),
        },
      ],
    )
    messageToSend._id = messageID[0]
    return this.decodeMessage(messageToSend)
  }

  /**
   * @method editMessage
   * @description Edits a message to the given recipient
   * @param id Message id
   * @param groupChatID
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

    const records = await this.textile.client.find<MessageFromThread>(
      this.threadID,
      message.to,
      Query.where('_id').eq(id),
    )
    if (records.length > 0) {
      const [record] = records
      record.body = body
      record.signature = signature
      delete record._mod
      await this.textile.client.save(this.threadID, message.to, [record])
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
    // const identity: Identity = this.textile.identity
    // eslint-disable-next-line camelcase
    const { _id, from, read_at, created_at } = message
    // Body decryption and parse
    const msgBody = Buffer.from(message.body, EncodingTypesEnum.BASE64)
    const decoded = new TextDecoder().decode(msgBody)
    console.log(decoded, "decoded")
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
      console.log(validation)
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
