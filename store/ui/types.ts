import { TranslateResult } from 'vue-i18n'
import { FileMessage } from '~/types/textile/mailbox'
import { Glyph } from '~/types/ui/glyph'
import { Channel } from '~/types/ui/server'
import { Alert } from '~/libraries/ui/Alerts'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'

export enum GlyphMarketViewStatus {
  HOME = 'home',
  SHOP_ALL = 'shop_all',
  SHOP_DETAIL = 'shop_detail',
}

export enum ModalWindows {
  NEW_FOLDER = 'newfolder',
  CREATE_SERVER = 'createServer',
  MARKETPLACE = 'marketplace',
  WALLET = 'wallet',
  WALLET_MINI = 'walletMini',
  ERROR = 'error',
  CHANGELOG = 'changelog',
  GLYPH = 'glyph',
  USER_PROFILE = 'userProfile',
  CALL_TO_ACTION = 'callToAction',
  RENAME_FILE = 'renameFile',
}

export interface EnhancerInfo {
  show: boolean
  floating?: boolean
  position?: number[]
  defaultWidth?: string
  defaultHeight?: string
  containerWidth?: number
  route: string
}

export interface EmojiUsage {
  code: string
  count: number
  content: string
}

export interface RecentGlyph {
  pack: Glyph
  url: string
  count: number
}

export enum SettingsRoutes {
  PERSONALIZE = 'personalize',
  PROFILE = 'profile',
  AUDIO_AND_VIDEO = 'audio & Video',
  KEY_BINDS = 'keybinds',
  ACCOUNTS_AND_DEVICES = 'accounts & Devices',
  PRIVACY = 'privacy',
  DEVELOPER = 'developer',
  INFO = 'info',
  NOTIFICATIONS = 'notifications',
  STORAGE = 'storage',
  NETWORK = 'network',
  REALMS = 'realms',
}

export type ContextMenuItemTypes = 'primary' | 'danger'

export interface ContextMenuItem {
  text: string | TranslateResult
  func: Function
  type?: ContextMenuItemTypes
}

export interface UIState {
  contextMenuStatus: boolean
  contextMenuValues: ContextMenuItem[]
  quickProfile: object | boolean
  userProfile: object
  notifications: Alert[]
  contextMenuPosition: object
  quickProfilePosition: object
  showSettings: boolean
  settingsSideBar: boolean
  settingsRoute: SettingsRoutes
  showSidebarUsers: boolean
  showSearchResult: boolean
  showSidebar: boolean
  modals: {
    [key in ModalWindows]: boolean | object
  }
  glyphModalPack: string
  chatbarContent: string
  chatbarFocus: boolean
  replyChatbarMessage?: ConversationMessage
  showPinned: boolean
  fullscreen: boolean
  enhancers: EnhancerInfo
  messages: any[]
  unreadMessage: number
  isScrollOver: boolean
  showOlderMessagesInfo: boolean
  isTyping: object | boolean
  isReacted: boolean
  activeChannel: Channel | undefined
  settingReaction: object
  hoveredGlyphInfo: object | undefined
  glyphMarketplaceView: object
  editMessage: {
    id: string
    from: string
    payload: string
  }
  mostEmojiUsed: EmojiUsage[]
  recentGlyphs: RecentGlyph[]
  chatImageOverlay?: FileMessage
  isMobileNavVisible: boolean
}

export type Position = {
  x: number
  y: number
}
