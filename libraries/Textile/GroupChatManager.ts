import { Identity, PublicKey, ThreadID, Update } from '@textile/hub'
import { Query } from '@textile/threads-client'
import { isRight } from 'fp-ts/lib/Either'
import { v4 as uuid } from 'uuid'
import Vue from 'vue'
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
import Crypto from '~/libraries/Crypto/Crypto'
import { AccountsError } from '~/store/accounts/types'
import { Groups } from '~/mock/groups'

export class GroupChatManager {
  senderAddress: string
  textile: TextileInitializationData
  threadID: ThreadID
  identity: Identity
  listeners: {
    message?: (reply?: Update<any> | undefined, err?: Error | undefined) => void
  }

  constructor(
    textile: TextileInitializationData,
    senderAddress: string,
    identity: Identity,
  ) {
    this.identity = identity
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
    const group = Groups.find((group) => {
      if (group.address === groupChatID) {
        return group.encryptionKey
      }
      return undefined
    })
    if (!group) {
      throw new Error(AccountsError.CANNOT_FIND_GROUP)
    }
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
      const group = Groups.find((group) => {
        if (group.address === groupChatId) {
          return group.encryptionKey
        }
        return undefined
      })
      if (!group) {
        throw new Error(AccountsError.CANNOT_FIND_GROUP)
      }

      if (update?.instance) {
        this.decodeMessage(update.instance, group.encryptionKey).then(
          (decoded) => {
            onMessage(decoded)
          },
        )
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
   * @param to
   * @param message Message to be sent
   */
  async sendMessage<T extends MessageTypes>(
    to: string,
    message: MessagePayloads[T],
  ) {
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

    const group = Groups.find((group) => {
      if (group.address === message.to) {
        return group.encryptionKey
      }
      return undefined
    })
    if (!group) {
      throw new Error(AccountsError.CANNOT_FIND_GROUP)
    }
    console.log(message)

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
      this.threadID,
      message.to,
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
}
