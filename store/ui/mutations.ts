import Vue from 'vue'
import { SettingsRoutes, UIState } from './types'
import { MessageAttachment } from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/users/types'

export default {
  toggleContextMenu(state: UIState, enabled: boolean) {
    state.contextMenuStatus = enabled
  },
  showSidebar(state: UIState, enabled: boolean) {
    state.showSidebar = enabled
  },
  setContextMenuValues(state: UIState, values: any) {
    state.contextMenuValues = values
  },
  setContextMenuPosition(state: UIState, e: MouseEvent) {
    state.contextMenuPosition = { x: e.x, y: e.y }
  },
  setQuickProfile(state: UIState, data: UIState['quickProfile']) {
    Vue.set(state, 'quickProfile', data)
  },
  setFullProfile(state: UIState, user?: User) {
    Vue.set(state, 'fullProfile', user)
  },
  chatbarContent(state: UIState, content: string) {
    state.chatbarContent = content
  },
  setChatImageOverlay(
    state: UIState,
    file?: MessageAttachment & { dataURL: string },
  ) {
    state.chatImageOverlay = file
  },
  setSettingsRoute(
    state: UIState,
    route: SettingsRoutes = SettingsRoutes.PERSONALIZE,
  ) {
    state.settingsRoute = route
  },
  toggleModal(state: UIState, modal: any) {
    // @ts-ignore
    state.modals[modal.name] = modal.state
  },
  toggleErrorNetworkModal(
    state: UIState,
    modal: { state: boolean; action: Function | null },
  ) {
    // @ts-ignore
    state.modals.errorNetwork = { isOpen: modal.state, action: modal.action }
  },
  setGlyphModalPackId(state: UIState, packId: string) {
    state.glyphModalPackId = packId
  },
  /**
   * Called when user click the Edit Message on Context Menu or Edit action in message listings
   * @param {UIState} state - Vuex state
   * @param message  - Message to edit {id: message's id, from: group's id, payload: content}
   */
  setEditMessage(
    state: UIState,
    message: {
      id: string
      from: string
      payload: string
    },
  ) {
    state.editMessage = message
  },
  setHoveredGlyphInfo(state: UIState, values: Object | undefined) {
    state.hoveredGlyphInfo = values
  },
  setGlyphMarketplaceView(state: UIState, values: Object) {
    state.glyphMarketplaceView = values
  },
  updateMostUsedEmoji(state: UIState, emojiObj: any) {
    const emojiUsed = state.mostEmojiUsed.find(
      (elm) => elm.code === emojiObj.name,
    )
    if (emojiUsed) {
      emojiUsed.count++
      return
    }
    state.mostEmojiUsed.push({
      code: emojiObj.name,
      content: emojiObj.emoji,
      count: 1,
    })
  },
  setChatbarFocus(state: UIState, status: boolean) {
    state.chatbarFocus = status
  },
  setIsMobileNavVisible(state: UIState, value: boolean) {
    state.isMobileNavVisible = value
  },
  setCallHeight(state: UIState, value: string) {
    state.callHeight = value
  },
}
