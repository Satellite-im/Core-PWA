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
  hoveredGlyphInfo: undefined,
  glyphMarketplaceView: {
    view: GlyphMarketViewStatus.HOME,
    shopId: null,
  },
  editMessage: { id: '', from: '', payload: '' },
  mostEmojiUsed: [],
  chatImageOverlay: undefined,
  isMobileNavVisible: true,
  callHeight: 'auto',
})

export default InitialUIState
