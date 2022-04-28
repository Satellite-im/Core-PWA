/**
 * NB: We are using io-ts library to validate data that comes from untrusted
 * sources like Textile database. The library allows to easily create type safe
 * Encoders/Decoders. We can derive the typescript related type using their
 * utilities like we do in this section
 */

import { MailboxEvent } from '@textile/hub'
import { TypeOf } from 'io-ts'
import {
  decryptedMessage,
  fileMessage,
  glyphMessage,
  imageMessage,
  mediaMessage,
  messageEncoder,
  messageFromThread,
  reactionMessage,
  replyMessage,
  textMessage,
} from '~/libraries/Textile/encoders'

/**
 * DecryptedMessage is the type that represent the data coming from textile mailbox
 * after being decrypted by the library. This is meant to be a low level data type.
 * The application level message type can be decoded from the body property
 */
export type DecryptedMessage = TypeOf<typeof decryptedMessage>

/**
 * ReplyMessage, ReactionMessage, FileMessage, TextMessage
 * are all types that represent specific type of messages decoded from the body
 * property of a DecryptedMessage
 */
export type ReplyMessage = TypeOf<typeof replyMessage>
export type ReactionMessage = TypeOf<typeof reactionMessage>
export type FileMessage = TypeOf<typeof fileMessage>
export type ImageMessage = TypeOf<typeof imageMessage>
export type TextMessage = TypeOf<typeof textMessage>
export type MediaMessage = TypeOf<typeof mediaMessage>
export type GlyphMessage = TypeOf<typeof glyphMessage>

/**
 * This interface is useful for defining new message types that
 * are included automatically in the MessageTypes. It can be used
 * also for extracting a specific type using typeof operator
 * @example
 * typeof MTypes['reaction']
 */
export interface MTypes {
  reply: ReplyMessage
  reaction: ReactionMessage
  file: FileMessage
  image: ImageMessage
  text: TextMessage
  glyph: GlyphMessage
}

export type MessageTypes = keyof MTypes

/**
 * This interface contains a derived version of each message type
 * that does not include some specific properties (id, at, from)
 * MessagePayload is the type that contains all the properties
 * that are needed to send a new message (the omitted properties will
 * be added by Textile)
 */
export interface MessagePayloads {
  reply: Omit<ReplyMessage, 'id' | 'at' | 'from'>
  reaction: Omit<ReactionMessage, 'id' | 'at' | 'from'>
  file: Omit<FileMessage, 'id' | 'at' | 'from'>
  image: Omit<ImageMessage, 'id' | 'at' | 'from'>
  text: Omit<TextMessage, 'id' | 'at' | 'from'>
  glyph: Omit<GlyphMessage, 'id' | 'at' | 'from'>
}

export type MessagePayload = MessagePayloads[keyof MessagePayloads]

/**
 * The Message type is derived from the messageEncoder. This encoder is
 * just the union of all the message subtype encoders and so it is the
 * resulting type
 */
export type Message = TypeOf<typeof messageEncoder>

/**
 * It represent how a UserMessage from Textile Mailbox looks
 * like if you read it directly from a thread
 */
export type MessageFromThread = TypeOf<typeof messageFromThread>

export type MailboxCallback = (
  reply?: MailboxEvent | undefined,
  err?: Error | undefined,
) => void

export type MessageCallback = (message?: Message) => void

export enum MailboxSubscriptionType {
  inbox = 'inbox',
  sentbox = 'sentbox',
}

/**
 * Parameters that we need in order to query for new conversation. It's
 * needed for the load more functionality
 */
export interface ConversationQuery {
  limit?: number
  skip?: number
}

/**
 * Messages, replies and Reactions are stored in an object structure. Messages are indexed by
 * message id, replies and reactions are indexed by the message id they are referring to.
 */
export type MessageTrackerValues =
  | FileMessage
  | TextMessage
  | GlyphMessage
  | ImageMessage

export type MessagesTracker = {
  [key: string]: MessageTrackerValues
}
export type RepliesTracker = { [key: string]: ReplyMessage[] }
export type ReactionsTracker = { [key: string]: ReactionMessage[] }
