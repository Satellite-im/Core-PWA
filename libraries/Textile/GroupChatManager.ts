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
    friendIdentifiers: Array<string>,
  ): Promise<string> {
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
  }): Promise<MessageFromThread[]> {
    let groupChatQuery = {}

    // if messages are stored in indexeddb, only fetch new messages from textile
    if (lastInbound) {
      lastInbound = lastInbound * 1000000 // textile has a more specific unix timestamp, matching theirs
      groupChatQuery = Query.where(PropCommonEnum.MOD)
        .ge(lastInbound)
        .orderByIDDesc()
    }

    // const lastMessageTime = encryptedInbox?.[0]?.created_at || 0
    // const firstMessageTime =
    //   encryptedInbox?.[encryptedInbox.length - 1]?.created_at || 0
    //
    // const messages = [...encryptedInbox].sort(
    //   (a, b) => a.created_at - b.created_at,
    // )
    //
    // const promises = messages.map<Promise<Message>>(this.decodeMessage)
    //
    // const checkdecode = this.decodeMessage(userMessageToGroup(messages))
    // const allSettled = await Promise.allSettled(promises)
    // console.log('check decode', allSettled)
    // const filtered = allSettled.filter(
    //   (r) => r.status === PropCommonEnum.FULFILLED,
    // ) as PromiseFulfilledResult<Message>[]
    // return filtered.map((r) => r.value)
    return await this.textile.client.find<MessageFromThread>(
      this.threadID,
      groupChatID,
      groupChatQuery,
    )
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
    // const encoder = new TextEncoder()
    // const body = encoder.encode(
    //   JSON.stringify({
    //     from: this.senderAddress,
    //     to: message.to,
    //     at: Date.now(),
    //     type: message.type,
    //     payload: message.payload,
    //     reactedTo:
    //       message.type === MessagingTypesEnum.REACTION
    //         ? message.reactedTo
    //         : undefined,
    //     repliedTo:
    //       message.type === MessagingTypesEnum.REPLY
    //         ? message.repliedTo
    //         : undefined,
    //     replyType:
    //       message.type === MessagingTypesEnum.REPLY
    //         ? message.replyType
    //         : undefined,
    //     pack:
    //       message.type === MessagingTypesEnum.GLYPH ? message.pack : undefined,
    //   }),
    // )

    const result = await this.textile.client.create(this.threadID, message.to, [
      { message },
    ])

    // const newMessageToThread = {
    //   createdAt: 0,
    //   id: result[0],
    //   from: this.senderAddress,
    //   body,
    //   signature: Buffer.from(this.senderAddress).toString(
    //     EncodingTypesEnum.BASE64,
    //   ),
    //   to: message.to,
    //   readAt: undefined,
    // }

    // return this.decodeMessage(userMessageToGroup(newMessageToThread))
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
}

/**
 * @function userMessageToThread
 * Converts the UserMessage type into its threadDB representation
 * @param message the user message to convert
 * @returns the converted message
 */
function userMessageToGroup(message: {
  createdAt: number
  signature: string
  readAt: number | undefined
  from: string
  id: string
  to: any
  body: Uint8Array
}): MessageFromThread {
  const { body, createdAt, from, id, readAt, signature, to } = message
  return {
    _id: id,
    body: Buffer.from(body).toString(EncodingTypesEnum.BASE64),
    created_at: createdAt,
    read_at: readAt,
    _mod: createdAt,
    from,
    signature,
    to,
  }
}
