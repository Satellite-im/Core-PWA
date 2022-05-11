import {
  MessagesTracker,
  MessageTrackerValues,
  ReactionsTracker,
  RepliesTracker,
} from '~/types/textile/mailbox'
import { UserThreadData } from '~/types/textile/user'

export interface Conversation {
  [key: string]: {
    type: 'friend' | 'group'
    messages: MessagesTracker
    replies: RepliesTracker
    reactions: ReactionsTracker
    lastInbound: number // the last time a message was received by any member of conversation, other than account owner
    lastUpdate: number // the last time a message was received by any member of conversation, including account owner
    lastMessage: MessageTrackerValues | null
    limit: number
    skip: number
    end: boolean
  }
}
export interface TextileState {
  initialized: boolean
  activeConversation?: string
  conversations: Conversation
  conversationLoading: boolean
  messageLoading: boolean
  uploadProgress: {
    [key: string]: {
      progress: number
      finished: boolean
      name: string
    }
  }
  threadData: UserThreadData
}

export enum TextileError {
  EDIT_HOT_KEY_ERROR = 'pages.settings.keybinds.editHotkeyError',
  FRIEND_NOT_FOUND = 'errors.textile.friend_not_found',
  MAILBOX_MANAGER_NOT_FOUND = 'errors.textile.mailbox_manager_not_found',
  MAILBOX_MANAGER_NOT_INITIALIZED = 'errors.textile.mailbox_manager_not_initialized',
  METADATA_MANAGER_NOT_FOUND = 'errors.textile.metadata_manager_not_found',
  USERINFO_MANAGER_NOT_FOUND = 'errors.textile.userinfo_manager_not_found',
  BUCKET_NOT_INITIALIZED = 'errors.textile.bucket_not_initialized',
}
