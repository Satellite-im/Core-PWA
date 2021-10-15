import { MailboxEvent, UserMessage } from '@textile/hub'

export interface IMessage extends UserMessage {
  sender: string
  to: ''
  at: number
  type: string
  payload: any
  encrypted: boolean
  secure: boolean
  metadata: object
}

/**
 * A simple type to hold inbox messages after they have been
 * decrypted with the PrivateKey
 */
export interface DecryptedMessage {
  id: string
  body: string
  from: string
  sent: number
  readAt?: number
}

// The user message when is read using thread db client
export interface MessageFromThread {
  _id: string
  created_at: number // eslint-disable-line camelcase
  read_at?: number // eslint-disable-line camelcase
  from: string
  body: string
  signature: string
  to: string
  _mod: number
}

export type MailboxCallback = (
  reply?: MailboxEvent | undefined,
  err?: Error | undefined
) => void

export enum MailboxSubscriptionType {
  inbox = 'inbox',
  sentbox = 'sentbox',
}

export interface ConversationQuery {
  limit?: number
  skip?: number
}

export type MessageCallback = (message?: DecryptedMessage) => void
