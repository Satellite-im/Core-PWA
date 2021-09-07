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
  fullscreen: Boolean
  showEnhancers: Boolean
  messages: any[]
  unreadMessage: number
  isScrollOver: boolean
  isTyping: Object | Boolean
  settingReaction: Object
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
  },
  chatbarContent: '',
  fullscreen: false,
  showEnhancers: false,
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
  isTyping: false,
  settingReaction: { status: false, groupID: null, messageID: null },
})

export default InitalUIState
