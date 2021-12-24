import { Channel } from '~/types/ui/server'

export enum ThemeNames {
  DEFAULT = 'default',
  MOONLESS = 'moonless_night',
}

export type Theme = {
  name: ThemeNames,
  class: String,
}

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
  code: string,
  count: number,
  content: string,
}

export interface UIState {
  contextMenuStatus: Boolean
  contextMenuValues: Array<Object>
  quickProfile: Object | Boolean
  contextMenuPosition: Object
  quickProfilePosition: Object
  showSettings: Boolean
  settingsSideBar: Boolean
  showSidebarUsers: Boolean
  showSearchResult: Boolean
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
  recentReactions: Array<String>,
  mostEmojiUsed: Array<EmojiUsage>,
  theme: {
    base: Theme,
    flair: String,
  },
}
