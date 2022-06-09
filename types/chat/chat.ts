import { MessageGroup } from '~/types/messaging'

export type ReplyObj = {
  replyId: string
  value: boolean
}

export type ChatTextObj = {
  userId: string
  value: string
}

export enum ScrollDirections {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

export interface ICurrentChat {
  messages: MessageGroup
  page: number
  size: number
  hasNextPage: boolean
  direction: keyof typeof ScrollDirections
  isMessagesLoading: boolean
  lastLoadedMessageId: string
  offset: number
}
