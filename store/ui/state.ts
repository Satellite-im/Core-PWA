interface UIState {
  contextMenuStatus: boolean
  contextMenuValues: Array<object>
  contextMenuPosition: Object
}

const InitalUIState: UIState = {
  contextMenuStatus: false,
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 }
}

export default InitalUIState