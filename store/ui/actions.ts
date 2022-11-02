import Mousetrap from 'mousetrap'
import { UIState, ModalWindows } from './types'
import { ActionsArguments } from '~/types/store/store'
import { getCorrectKeybind } from '~/utilities/Keybinds'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Friend } from '~~/libraries/Iridium/friends/types'

export default {
  /**
   * @method activateKeybinds
   * @description Activates all keybindings with Mousetrap
   * @example mounted (){ activateKeybinds() }
   */
  async activateKeybinds({ dispatch, commit }: ActionsArguments<UIState>) {
    const { toggleMute, toggleDeafen, openSettings, callActiveChat } =
      iridium.settings.state.keybinds
    Mousetrap.reset()
    Mousetrap.bind(getCorrectKeybind(toggleMute), (event: KeyboardEvent) => {
      event.preventDefault()
      dispatch('audio/toggleMute', null, { root: true })
    })
    Mousetrap.bind(getCorrectKeybind(toggleDeafen), (event: KeyboardEvent) => {
      event.preventDefault()
      dispatch('audio/toggleDeafen', null, { root: true })
    })
    Mousetrap.bind(getCorrectKeybind(openSettings), (event: KeyboardEvent) => {
      event.preventDefault()
      commit('setSettingsRoute')
    })
    Mousetrap.bind(
      getCorrectKeybind(callActiveChat),
      (event: KeyboardEvent) => {
        event.preventDefault()
        dispatch('webrtc/call', ['audio'], { root: true })
      },
    )
  },
  /**
   * @method clearKeybinds
   * @description Unbinds all current keybindings with Mousetrap
   * @example destroyed (){ clearKeybinds() }
   */
  async clearKeybinds({}: ActionsArguments<UIState>) {
    Mousetrap.reset()
  },
  async setChatbarFocus({ dispatch }: ActionsArguments<UIState>) {
    await dispatch('toggleChatbarFocus', false)
    dispatch('toggleChatbarFocus', true)
  },
  toggleChatbarFocus({ commit }: ActionsArguments<UIState>, flag: boolean) {
    commit('setChatbarFocus', flag)
  },
  setChatbarContent(
    { commit }: ActionsArguments<UIState>,
    val: {
      content: string
      userId?: string
    },
  ) {
    commit('chatbarContent', val.content)
  },
  async showProfile({ commit }: ActionsArguments<UIState>, user: Friend) {
    commit('toggleModal', {
      name: 'userProfile',
      state: true,
    })
    commit('setUserProfile', user)
  },
  displayConsentSettings({ commit, state }: ActionsArguments<UIState>) {
    commit(
      'ui/toggleModal',
      {
        name: ModalWindows.CONSENT_SCAN_CONFIRMATION,
        state: !state.modals[ModalWindows.CONSENT_SCAN_CONFIRMATION],
      },
      { root: true },
    )
  },
}
