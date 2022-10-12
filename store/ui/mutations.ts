import Vue from 'vue'
import { SettingsRoutes, UIState, EnhancerInfo, RecentGlyph } from './types'
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
  toggleEnhancers(state: UIState, options: EnhancerInfo) {
    state.enhancers = {
      show: options.show,
      floating:
        typeof options.floating !== 'undefined'
          ? options.floating
          : state.enhancers.floating,
      position:
        typeof options.position !== 'undefined'
          ? options.position
          : state.enhancers.position,
      defaultWidth:
        typeof options.defaultWidth !== 'undefined'
          ? options.defaultWidth
          : state.enhancers.defaultWidth,
      defaultHeight:
        typeof options.defaultHeight !== 'undefined'
          ? options.defaultHeight
          : state.enhancers.defaultHeight,
      containerWidth:
        typeof options.containerWidth !== 'undefined'
          ? options.containerWidth
          : state.enhancers.containerWidth,
      route: options.route || 'emoji',
    }
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
  setShowOlderMessagesInfo(state: UIState, flag: boolean) {
    state.showOlderMessagesInfo = flag
  },
  settingReaction(state: UIState, status: object) {
    state.settingReaction = status // TODO: check this mutation, probably a bug
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
  updateRecentGlyphs(state: UIState, glyph: RecentGlyph) {
    const glyphUsed = state.recentGlyphs.find((e) => e.url === glyph.url)
    if (glyphUsed) {
      glyphUsed.count++
      return
    }
    state.recentGlyphs.push({
      pack: glyph.pack,
      url: glyph.url,
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
