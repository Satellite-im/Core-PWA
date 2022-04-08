import {
  FileMessage,
  GlyphMessage,
  ImageMessage,
  ReplyMessage,
  TextMessage,
} from './textile/mailbox'
import { MessagingTypesEnum } from '~/libraries/Enums/enums'

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
  | ConvertToUIMessage<ImageMessage>
  | ConvertToUIMessage<TextMessage>
  | ConvertToUIMessage<GlyphMessage>

export type Divider = {
  id: string
  at: number
  type: 'divider'
}

// TO DO: MAURO CHECK
export type Group = {
  id: string
  at: number
  type: 'group'
  from: string
  to: string
  messages: Array<UIMessage> | null
}

// TO DO: MAURO CHECK
export type MessageGroup = Array<Group | Divider>

export type MessageElement = {
  id: string
  at: number
  type: MessagingTypesEnum.MESSAGEELEMENT
  from: string
  to: string
  messages: Array<UIMessage> | null
}

export type ChatList = Array<MessageElement | Divider>
