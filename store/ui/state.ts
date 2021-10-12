import { Channel } from '~/types/ui/server'

interface UIState {
  contextMenuStatus: Boolean
  contextMenuValues: Array<Object>
  quickProfile: Object | Boolean
  contextMenuPosition: Object
  quickProfilePosition: Object
  showSettings: Boolean
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
  showEnhancers: Boolean
  messages: any[]
  unreadMessage: number
  isScrollOver: boolean
  isTyping: Object | Boolean
  activeChannel: Channel | undefined
  settingReaction: Object
  hoveredGlyphInfo: Object | undefined
  editMessage: {
    id: string
    from: string
    payload: string
  }
  recentReactions: Array<String>
}

const InitalUIState = (): UIState => ({
  contextMenuStatus: false,
  showSidebarUsers: true,
  showSearchResult: false,
  showSettings: false,
  quickProfile: false,
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 },
  quickProfilePosition: { x: 0, y: 0 },
  modals: {
    newfolder: false,
    createServer: false,
    showMarketPlace: false,
    wallet: false,
  },
  chatbarContent: '',
  replyChatbarContent: { id: '', from: '', payload: '' },
  fullscreen: false,
  showPinned: false,
  showEnhancers: false,
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
  isTyping: false,
  activeChannel: undefined,
  settingReaction: { status: false, groupID: null, messageID: null },
  hoveredGlyphInfo: undefined,
  editMessage: { id: '', from: '', payload: '' },
  recentReactions: ['👍', '😂', '♥️'],
})

export default InitalUIState
