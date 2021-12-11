import { UIState } from './types'
import { Channel } from '~/types/ui/server'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { ActionsArguments } from '~/types/store/store'
// @ts-ignore
import Mousetrap from 'mousetrap'

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
  addReaction({ commit }: ActionsArguments<UIState>, reaction: any) {
    commit('addReaction', reaction)
    commit('updateRecentReactions', reaction.emoji)
  },
  /**
   * @method openSettings
   * @description Opens setting page
   * @example Mousetrap.bind('ctrl+s', dispatch('audio/toggleMute') )
   */
  openSettings({ commit, state }: any) {
    commit('toggleSettings', !state.showSettings)
  },
  /**
   * @method activateKeybinds
   * @description Activates all keybindings with Mousetrap
   * @example mounted (){ activateKeybinds() }
   */
  async activateKeybinds({ dispatch, rootState }: ActionsArguments<UIState>) {
    const { toggleMute, toggleDeafen, openSettings } =
      // @ts-ignore
      rootState.settings.keybinds
    Mousetrap.reset()
    Mousetrap.bind(toggleMute, () =>
      dispatch('audio/toggleMute', null, { root: true })
    )
    Mousetrap.bind(toggleDeafen, () =>
      dispatch('audio/toggleDeafen', null, { root: true })
    )
    Mousetrap.bind(openSettings, () => dispatch('openSettings'))
  },
  /**
   * @method clearKeybinds
   * @description Unbinds all current keybindings with Mousetrap
   * @example destroyed (){ clearKeybinds() }
   */
  async clearKeybinds({ dispatch }: ActionsArguments<UIState>) {
    Mousetrap.reset()
  },
}
