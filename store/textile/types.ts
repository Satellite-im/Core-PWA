import { Message } from '~/types/textile/mailbox'

export interface TextileState {
  initialized: boolean
  conversations: {
    [key: string]: Message[]
  }
  conversationLoading: boolean
}

export enum TextileError {}
