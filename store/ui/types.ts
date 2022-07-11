import { TranslateResult } from 'vue-i18n'
import { FileMessage } from '~/types/textile/mailbox'
import { FileSortEnum } from '~/libraries/Enums/enums'
import { Glyph } from '~/types/ui/glyph'
import { Channel } from '~/types/ui/server'
import { Alert } from '~/libraries/ui/Alerts'
import { Fil } from '~/libraries/Files/Fil'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'

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
  QUICK_CHAT = 'quickchat',
  WALLET_MINI = 'walletMini',
  ERROR = 'error',
  CHANGELOG = 'changelog',
  GLYPH = 'glyph',
  USER_PROFILE = 'userProfile',
  CALL_TO_ACTION = 'callToAction',
  RENAME_FILE = 'renameFile',
  CROP = 'crop',
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

export interface ContextMenuItem {
  text: string | TranslateResult
  func: Function
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
  replyChatbarContent: {
    id: string
    from: string
    payload: string
  }
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
  theme: {
    base: Theme
    flair: Flair
  }
  filesUploadStatus: string
  renameItem?: Item
  filePreview?: Fil
  fileDownloadList: string[]
  chatImageOverlay?: FileMessage
  swiperSlideIndex: number
}

export type Position = {
  x: number
  y: number
}
