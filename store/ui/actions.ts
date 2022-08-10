import Mousetrap from 'mousetrap'
import { Position, SettingsRoutes, UIState } from './types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { ActionsArguments } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import { Channel } from '~/types/ui/server'
import { getFullUserInfoFromState } from '~/utilities/Messaging'
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
  async clearKeybinds({ dispatch }: ActionsArguments<UIState>) {
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
  showQuickProfile(
    { commit, state, rootState }: ActionsArguments<UIState>,
    payload: { textilePublicKey: string; position: Position },
  ) {
    if (!payload?.textilePublicKey || !payload?.position) {
      return
    }

    const selectedUser = getFullUserInfoFromState(
      payload.textilePublicKey,
      rootState,
    )

    commit('setQuickProfilePosition', payload.position)
    commit('quickProfile', selectedUser)
  },
  async showProfile({ commit }: ActionsArguments<UIState>, user: Friend) {
    commit('toggleModal', {
      name: 'userProfile',
      state: true,
    })
    commit('setUserProfile', user)
  },

  displayConsentSettings({ commit }: ActionsArguments<UIState>) {
    this.$toast.error(this.$i18n.t('pages.files.errors.enable_consent'), {
      duration: 3000,
    })
    if (this.$device.isMobile) {
      this.$router.push('/mobile/settings')
    }
    commit('setSettingsRoute', SettingsRoutes.PRIVACY)
  },
}
