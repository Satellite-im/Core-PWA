import { NuxtState } from '@nuxt/types/app'

export default {
  toggleContextMenu(state: NuxtState, enabled: Boolean) {
    state.ui = {
      ...state.ui,
      contextMenuStatus: enabled,
    }
  },
  setContextMenuValues(state: NuxtState, values: Boolean) {
    state.ui = {
      ...state.ui,
      contextMenuValues: values,
    }
  },
  setContextMenuPosition(state: NuxtState, position: Object) {
    state.ui = {
      ...state.ui,
      // @ts-ignore
      contextMenuPosition: { x: position.x, y: position.y},
    }
  },
}