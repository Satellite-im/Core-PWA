import { NuxtState } from '@nuxt/types/app'

export default {
  toggleContextMenu(state: NuxtState, enabled: Boolean) {
    state.ui = {
      ...state.ui,
      contextMenuStatus: enabled,
    }
  },
  showSidebarUsers(state: NuxtState, enabled: Boolean) {
    state.ui = {
      ...state.ui,
      showSidebarUsers: enabled,
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
      contextMenuPosition: { x: e.x, y: e.y },
    }
  },
  setQuickProfilePosition(state: NuxtState, e: any) {
    state.ui = {
      ...state.ui,
      quickProfilePosition: { x: e.x, y: e.y },
    }
  },
  quickProfile(state: NuxtState, profile: Object | Boolean) {
    state.ui = {
      ...state.ui,
      quickProfile: profile,
    }
  },
  chatbarContent(state: NuxtState, content: String) {
    state.ui = {
      ...state.ui,
      chatbarContent: content,
    }
  },
  fullscreen(state: NuxtState, fullscreen: Boolean) {
    state.ui = {
      ...state.ui,
      fullscreen,
    }
  },
  toggleEnhancers(state: NuxtState, show: Boolean) {
    state.ui = {
      ...state.ui,
      showEnhancers: show,
    }
  },
}
