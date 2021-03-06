import {
  FileMessage,
  GlyphMessage,
  ReplyMessage,
  TextMessage,
} from './textile/mailbox'

export type UIReaction = {
  emoji: string
  reactors: string[]
  showReactors: boolean
}

export type UIReply = ReplyMessage & {
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
  avatar: boolean
  id: string
  address: string
  at: number
  type: 'group'
  from: string
  to: string
  messages: Array<UIMessage> | null
  sender?: string
}

export type MessageGroup = Array<Group | Divider>
