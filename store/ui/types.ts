import { TranslateResult } from 'vue-i18n'
import { string } from 'io-ts'
import { ImageMessage } from '~/types/textile/mailbox'
import { FileSortEnum } from '~/libraries/Enums/enums'
import { Glyph } from '~/types/ui/glyph'
import { Channel } from '~/types/ui/server'
import { Alert } from '~/libraries/ui/Alerts'
import { Fil } from '~/libraries/Files/Fil'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
export enum ThemeNames {
  DEFAULT = 'default',
  MOONLESS = 'moonless_night',
}

export type Theme = {
  name: ThemeNames
  class: string
}

export const FlairColors: any = {
  SATELLITE: ['#2761fd', '#286CFE'],
  PEACH: ['#ED4C67', '#ED5672'],
  PINK: ['#FDA7DF', '#FDB1E9'],
  LIME: ['#A3CB38', '#AED542'],
  PURPLE: ['#6F1E51', '#80215D'],
  LAVENDER: ['#9980FA', '#A891FF'],
  SUNFLOWER: ['#FFC312', '#FACA3E'],
  DEEP_BLUE: ['#30336b', '#2D328A'],
  VOID: ['#2C3A47', '#36434F'],
}

export type FlairColor = { primary: string; secondary: string }

export type Flair = {
  text: string
  value: FlairColor
}

export const Flairs = [
  {
    text: 'Satellite',
    value: FlairColors.SATELLITE,
  },
  {
    text: 'Peach',
    value: FlairColors.PEACH,
  },
  {
    text: 'Pink',
    value: FlairColors.PINK,
  },
  {
    text: 'Lime',
    value: FlairColors.LIME,
  },
  {
    text: 'Purple',
    value: FlairColors.PURPLE,
  },
  {
    text: 'Lavender',
    value: FlairColors.LAVENDER,
  },
  {
    text: 'Sunflower',
    value: FlairColors.SUNFLOWER,
  },
  {
    text: 'Deep',
    value: FlairColors.DEEP_BLUE,
  },
  {
    text: 'Void',
    value: FlairColors.VOID,
  },
]

export const Themes = [
  {
    text: 'Default',
    name: ThemeNames.DEFAULT,
    value: ThemeNames.DEFAULT,
    class: '',
  },
  {
    text: 'Moonless Night',
    name: ThemeNames.MOONLESS,
    value: ThemeNames.MOONLESS,
    class: 'moonless_night',
  },
]

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

export interface FileSort {
  category: FileSortEnum
  asc: boolean
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
  showMedia: boolean
  settingsSideBar: boolean
  settingsRoute: SettingsRoutes
  showSidebarUsers: boolean
  showSearchResult: boolean
  showSidebar: boolean
  modals: {
    [key: string]: boolean | object
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
  chatImageOverlay?: ImageMessage
  fileSort: FileSort
  swiperSlideIndex: number
}

export type Position = {
  x: number
  y: number
}
