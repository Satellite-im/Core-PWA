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
      lastInbound: number // the last time a message was received by any member of conversation, other than account owner
      lastUpdate: number // the last time a message was received by any member of conversation, including account owner
      limit: number
      skip: number
      end: boolean
    }
  }
  conversationLoading: boolean
  messageLoading: boolean
  uploadProgress: {
    [key: string]: {
      progress: number
      finished: boolean
      name: string
  }
}
}

export enum TextileError {}
