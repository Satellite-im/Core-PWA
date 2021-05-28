interface UIState {
  contextMenuStatus: boolean
  contextMenuValues: Array<object>
  quickProfile: Object | Boolean
  contextMenuPosition: Object
  quickProfilePosition: Object
}

const InitalUIState: UIState = {
  contextMenuStatus: false,
  quickProfile: false,
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 },
  quickProfilePosition: { x: 0, y: 0 },
}

export default InitalUIState
