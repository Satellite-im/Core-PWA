import { UIState, GlyphMarketViewStatus } from './types'

const InitialUIState = (): UIState => ({
  contextMenuStatus: false,
  showSidebarUsers: true,
  showSearchResult: false,
  showSettings: false,
  settingsSideBar: true,
  quickProfile: false,
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 },
  quickProfilePosition: { x: 0, y: 0 },
  modals: {
    newfolder: false,
    createServer: false,
    marketPlace: false,
    wallet: false,
    quickchat: false,
    walletMini: false,
    error: false,
    changelog: false,
  },
  chatbarContent: '',
  replyChatbarContent: { id: '', from: '', payload: '' },
  fullscreen: false,
  showPinned: false,
  enhancers: {
    show: false,
    floating: false,
    position: [0, 0],
    defaultWidth: '24rem',
    defaultHeight: '30rem',
    containerWidth: 0,
    route: 'emotes',
  },
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
  isTyping: false,
  isReacted: false,
  activeChannel: undefined,
  settingReaction: { status: false, groupID: null, messageID: null },
  hoveredGlyphInfo: undefined,
  glyphMarketplaceView: {
    view: GlyphMarketViewStatus.HOME,
    shopId: null,
  },
  editMessage: { id: '', from: '', payload: '' },
  recentReactions: ['👍', '😂', '♥️'],
})

export default InitialUIState
