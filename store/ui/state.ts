import { UIState, GlyphMarketViewStatus, SettingsRoutes } from './types'

const InitialUIState = (): UIState => ({
  contextMenuStatus: false,
  notifications: [],
  showSidebar: true,
  showSearchResult: false,
  showSettings: false,
  settingsRoute: SettingsRoutes.EMPTY,
  quickProfile: false,
  userProfile: {},
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 },
  quickProfilePosition: { x: 0, y: 0 },
  modals: {
    newfolder: false,
    createServer: false,
    marketplace: false,
    wallet: false,
    walletMini: false,
    error: false,
    changelog: false,
    glyph: false,
    userProfile: false,
    callToAction: false,
    renameFile: false,
    errorNetwork: { isOpen: false, action: null },
    consentScanConfirmation: false,
  },
  glyphModalPackId: undefined,
  chatbarContent: '',
  chatbarFocus: false,
  showPinned: false,
  enhancers: {
    show: false,
    floating: false,
    position: [0, 0],
    defaultWidth: '24rem',
    defaultHeight: '30rem',
    containerWidth: 0,
    route: 'emoji',
  },
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
  showOlderMessagesInfo: false,
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
  mostEmojiUsed: [],
  recentGlyphs: [],
  chatImageOverlay: undefined,
  isMobileNavVisible: true,
  callHeight: 'auto',
})

export default InitialUIState
