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
      lastMsgReceived: number // the last time a message was received by any member of conversation other than account owner
      lastConvoUpdate: number // the last time a message was received by any member of conversation
      limit: number
      skip: number
      end: boolean
    }
  }
  conversationLoading: boolean
}

export enum TextileError {}
