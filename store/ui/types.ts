import { Glyph } from '~/types/ui/glyph'
import { Channel } from '~/types/ui/server'
import { User } from '~/types/ui/user'

export enum ThemeNames {
  DEFAULT = 'default',
  MOONLESS = 'moonless_night',
}

export type Theme = {
  name: ThemeNames
  class: string
}

export enum FlairColors {
  SATELLITE = '#2761fd',
  PEACH = '#ED4C67',
  PINK = '#FDA7DF',
  LIME = '#A3CB38',
  PURPLE = '#6F1E51',
  LAVENDER = '#9980FA',
  SUNFLOWER = '#FFC312',
  DEEP_BLUE = '#30336b',
  VOID = '#2C3A47',
}

export type Flair = {
  text: string
  value: FlairColors
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
  USERPROFILE = 'userProfile',
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

export interface UIState {
  contextMenuStatus: boolean
  contextMenuValues: object[]
  quickProfile: object | boolean
  userProfile: object
  contextMenuPosition: object
  quickProfilePosition: object
  showSettings: boolean
  settingsSideBar: boolean
  showSidebarUsers: boolean
  showSearchResult: boolean
  showSidebar: boolean
  modals: object
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
  recentReactions: string[]
  mostEmojiUsed: EmojiUsage[]
  recentGlyphs: RecentGlyph[]
  theme: {
    base: Theme
    flair: Flair
  }
  selectedUserInfo: User | undefined
}
