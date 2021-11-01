import { MailboxEvent, UserMessage } from '@textile/hub'
import { TypeOf } from 'io-ts'
import {
  decryptedMessage,
  messageFromThread,
  replyMessage,
  fileMessage,
  textMessage,
  reactionMessage,
  messageEncoder,
} from '~/libraries/Textile/encoders'

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

// Extract type from the decryptedMessage encoder
export type DecryptedMessage = TypeOf<typeof decryptedMessage>

// interface BaseMessage<T extends MessageTypes> {
//   id: string
//   at: number
//   from: string
//   to: string
//   type: T
// }

// export interface ReplyMessage extends BaseMessage<'reply'> {
//   payload: string
//   repliedTo: string
// }
// export interface ReactionMessage extends BaseMessage<'reaction'> {
//   payload: string
//   reactedTo: string
// }
// export interface FileMessage extends BaseMessage<'file'> {
//   payload: string
// }
// export interface TextMessage extends BaseMessage<'text'> {
//   payload: string
// }

export type ReplyMessage = TypeOf<typeof replyMessage>
export type ReactionMessage = TypeOf<typeof reactionMessage>
export type FileMessage = TypeOf<typeof fileMessage>
export type TextMessage = TypeOf<typeof textMessage>

export interface MTypes {
  reply: ReplyMessage
  reaction: ReactionMessage
  file: FileMessage
  text: TextMessage
}

export type MessageTypes = keyof MTypes
export interface MessagePayloads {
  reply: Omit<ReplyMessage, 'id' | 'at' | 'from'>
  reaction: Omit<ReactionMessage, 'id' | 'at' | 'from'>
  file: Omit<FileMessage, 'id' | 'at' | 'from'>
  text: Omit<TextMessage, 'id' | 'at' | 'from'>
}

export type Message = TypeOf<typeof messageEncoder>
export type MessagePayload = MessagePayloads[keyof MessagePayloads]
// export interface MessageGroup extends BaseMessage<'group'> {
//   messages: Message[]
// }

// The user message when is read using thread db client
// export interface MessageFromThread {
//   _id: string
//   created_at: number // eslint-disable-line camelcase
//   read_at?: number // eslint-disable-line camelcase
//   from: string
//   body: string
//   signature: string
//   to: string
//   _mod: number
// }

// Extract type from the messageFromThread encoder
export type MessageFromThread = TypeOf<typeof messageFromThread>

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

export type MessageCallback = (message?: Message) => void
