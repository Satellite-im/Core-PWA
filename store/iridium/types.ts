import {
  MessagesTracker,
  MessageTrackerValues,
  ReactionsTracker,
  RepliesTracker,
} from '~/types/textile/mailbox'
import { MessageGroup } from '~/types/messaging'

export interface Conversation {
  [key: string]: {
    type: 'friend' | 'group'
    messages: MessagesTracker
    replies: RepliesTracker
    reactions: ReactionsTracker
    groupedMessages: MessageGroup
    lastInbound: number // the last time a message was received by any member of conversation, other than account owner
    lastUpdate: number // the last time a message was received by any member of conversation, including account owner
    lastMessage: MessageTrackerValues | null
    limit: number
    skip: number
    end: boolean
  }
}
export interface IridiumState {
  initialized: boolean
  conversations: Conversation
  activeConversation?: string
  conversationLoading?: boolean
  messageLoading?: boolean
  uploadProgress?: {
    [key: string]: {
      progress: number
      finished: boolean
      name: string
    }
  }
}

export enum IridiumError {
  EDIT_HOT_KEY_ERROR = 'pages.settings.keybinds.editHotkeyError',
  FRIEND_NOT_FOUND = 'errors.iridium.friend_not_found',
  MAILBOX_MANAGER_NOT_FOUND = 'errors.iridium.mailbox_manager_not_found',
  MAILBOX_MANAGER_NOT_INITIALIZED = 'errors.iridium.mailbox_manager_not_initialized',
  METADATA_MANAGER_NOT_FOUND = 'errors.iridium.metadata_manager_not_found',
  USERINFO_MANAGER_NOT_FOUND = 'errors.iridium.userinfo_manager_not_found',
  BUCKET_NOT_INITIALIZED = 'errors.iridium.bucket_not_initialized',
}
