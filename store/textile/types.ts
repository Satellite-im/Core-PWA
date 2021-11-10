import {
  MessagesTracker,
  RepliesTracker,
  ReactionsTracker,
} from '~/types/textile/mailbox'

export interface TextileState {
  initialized: boolean
  conversations: {
    [key: string]: {
      messages: MessagesTracker
      replies: RepliesTracker
      reactions: ReactionsTracker
      limit: number
      skip: number
      end: boolean
    }
  }
  conversationLoading: boolean
}

export enum TextileError {}
