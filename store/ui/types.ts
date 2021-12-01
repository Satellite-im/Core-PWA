import { Channel } from '~/types/ui/server'

export enum GlyphMarketViewStatus {
  HOME = 'home',
  SHOP_ALL = 'shop_all',
  SHOP_DETAIL = 'shop_detail',
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
}
