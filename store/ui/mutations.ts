import { NuxtState } from '@nuxt/types/app'

export default {
  toggleContextMenu(state: NuxtState, enabled: Boolean) {
    state.ui = {
      ...state.ui,
      contextMenuStatus: enabled,
    }
  },
  setContextMenuValues(state: NuxtState, values: any) {
    state.ui = {
      ...state.ui,
      contextMenuValues: values,
    }
  },
  setContextMenuPosition(state: NuxtState, e: any) {
    state.ui = {
      ...state.ui,
      // @ts-ignore
      contextMenuPosition: { x: e.x, y: e.y },
    }
  },
  setQuickProfilePosition(state: NuxtState, e: any) {
    state.ui = {
      ...state.ui,
      // @ts-ignore
      quickProfilePosition: { x: e.x, y: e.y },
    }
  },
  quickProfile(state: NuxtState, profile: Object | Boolean) {
    state.ui = {
      ...state.ui,
      // @ts-ignore
      quickProfile: profile,
    }
  },
}
