import { MessageGroup } from '~/types/messaging'

export type ReplyObj = {
  replyId: string
  value: boolean
}

export type ChatTextObj = {
  userId: string
  value: string
}

export interface ICurrentChat {
  messages: MessageGroup
  page: number
  size: number
  hasNextPage: boolean
  direction: 'top' | 'bottom'
  isMessagesLoading: boolean
  lastLoadedMessageId: string
  isScrollOver: boolean
  offset: number
}
