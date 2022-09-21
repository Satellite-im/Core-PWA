import Mousetrap from 'mousetrap'
import { Position, UIState, ModalWindows } from './types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { ActionsArguments } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import { Channel } from '~/types/ui/server'
import { getCorrectKeybind } from '~/utilities/Keybinds'
import iridium from '~/libraries/Iridium/IridiumManager'

const $Sounds = new SoundManager()

export default {
  setMessages({ commit }: ActionsArguments<UIState>, messages: any[]) {
    commit('setMessages', messages)
  },
  sendMessage({ commit, rootState }: ActionsArguments<UIState>, message: any) {
    if (message.user.address !== rootState.accounts.active) {
      $Sounds.playSound(Sounds.NEW_MESSAGE)
    }
    commit('sendMessage', message)
  },
  setIsScrollOver({ commit }: ActionsArguments<UIState>, status: boolean) {
    commit('setIsScrollOver', status)
  },
  setIsReacted({ commit }: ActionsArguments<UIState>, status: boolean) {
    commit('setIsReacted', status)
  },
  setActiveChannel({ commit }: ActionsArguments<UIState>, channel: Channel) {
    commit('setActiveChannel', channel)
  },
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
    { commit, dispatch }: ActionsArguments<UIState>,
    val: {
      content: string
      userId?: string
    },
  ) {
    commit('chatbarContent', val.content)
    if (val.userId)
      dispatch(
        'chat/setChatText',
        { value: val.content, userId: val.userId },
        { root: true },
      )
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
