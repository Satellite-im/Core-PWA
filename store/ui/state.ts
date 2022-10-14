import { UIState, GlyphMarketViewStatus, SettingsRoutes } from './types'

const InitialUIState = (): UIState => ({
  contextMenuStatus: false,
  showSidebar: true,
  settingsRoute: SettingsRoutes.EMPTY,
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 },
  modals: {
    marketplace: false,
    wallet: false,
    changelog: false,
    glyph: false,
    callToAction: false,
    renameFile: false,
    errorNetwork: { isOpen: false, action: null },
    consentScanConfirmation: false,
  },
  glyphModalPackId: undefined,
  chatbarContent: '',
  chatbarFocus: false,
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
  showOlderMessagesInfo: false,
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
