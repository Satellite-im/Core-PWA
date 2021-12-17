import { FileMessage, GlyphMessage, ReplyMessage, TextMessage } from './textile/mailbox'

export type UIReaction = {
  emoji: string
  reactors: string[]
  showReactors: boolean
}

export interface UIReply extends ReplyMessage {
  reactions: Array<UIReaction>
}

type ConvertToUIMessage<T> = T & {
  replies: Array<UIReply>
  reactions: Array<UIReaction>
}

export type UIMessage =
  | ConvertToUIMessage<FileMessage>
  | ConvertToUIMessage<TextMessage>
  | ConvertToUIMessage<GlyphMessage>

export type Divider = {
  id: string
  at: number
  type: 'divider'
}

export type Group = {
  id: string
  at: number
  type: 'group'
  from: string
  to: string
  messages: Array<UIMessage> | null
}

export type MessageGroup = Array<Group | Divider>
