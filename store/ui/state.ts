interface UIState {
  contextMenuStatus: Boolean
  contextMenuValues: Array<Object>
  quickProfile: Object | Boolean
  contextMenuPosition: Object
  quickProfilePosition: Object
  showSidebarUsers: Boolean
  showSearchResult: Boolean
  modals: Object
  chatbarContent: String
  fullscreen: Boolean
  showEnhancers: Boolean
  settingReaction: Object
}

const InitalUIState = (): UIState => ({
  contextMenuStatus: false,
  showSidebarUsers: true,
  showSearchResult: false,
  quickProfile: false,
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 },
  quickProfilePosition: { x: 0, y: 0 },
  modals: {
    newfolder: false,
    createServer: false,
  },
  chatbarContent: '',
  fullscreen: false,
  showEnhancers: false,
  settingReaction: { status: false, groupID: null, messageID: null },
})

export default InitalUIState
