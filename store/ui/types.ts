import { Glyph } from '~/types/ui/glyph'
import { Channel } from '~/types/ui/server'

export enum ThemeNames {
  DEFAULT = 'default',
  MOONLESS = 'moonless_night',
}

export type Theme = {
  name: ThemeNames
  class: String
}

export enum FlairColors {
  PEACH = '#ED4C67',
  PINK = '#FDA7DF',
  LIME = '#A3CB38',
  PURPLE = '#6F1E51',
  PURPLER = '#9980FA',
  SUNFLOWER = '#FFC312',
  DEEP_BLUE = '#30336b',
  VOID = '#2C3A47',
}

export type Flair = {
  text: String
  value: FlairColors
}

export const Flairs = [
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
    text: 'Purpler',
    value: FlairColors.PURPLER,
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
  show: Boolean
  floating?: Boolean
  position?: Number[]
  defaultWidth?: String
  defaultHeight?: String
  containerWidth?: Number
  route: String
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
  contextMenuStatus: Boolean
  contextMenuValues: Array<Object>
  quickProfile: Object | Boolean
  userProfile: Object
  contextMenuPosition: Object
  quickProfilePosition: Object
  showSettings: Boolean
  settingsSideBar: Boolean
  settingsDefaultRoute: string
  showSidebarUsers: Boolean
  showSearchResult: Boolean
  showSidebar: boolean
  modals: Object
  glyphModalPack: String
  chatbarContent: String
  replyChatbarContent: {
    id: String
    from: String
    payload: String
  }
  showPinned: Boolean
  fullscreen: Boolean
  enhancers: EnhancerInfo
  messages: any[]
  unreadMessage: number
  isScrollOver: Boolean
  isTyping: Object | Boolean
  isReacted: Boolean
  activeChannel: Channel | undefined
  settingReaction: Object
  hoveredGlyphInfo: Object | undefined
  glyphMarketplaceView: Object
  editMessage: {
    id: string
    from: string
    payload: string
  }
  recentReactions: Array<String>
  mostEmojiUsed: Array<EmojiUsage>
  recentGlyphs: Array<RecentGlyph>
  theme: {
    base: Theme
    flair: Flair
  }
}
