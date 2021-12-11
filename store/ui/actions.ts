import { UIState } from './types'
import { Channel } from '~/types/ui/server'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { ActionsArguments } from '~/types/store/store'

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
  setActiveChannel({ commit }: ActionsArguments<UIState>, channel: Channel) {
    commit('setActiveChannel', channel)
  },
  addReaction({ commit }: ActionsArguments<UIState>, reaction: any) {
    commit('addReaction', reaction)
    commit('updateRecentReactions', reaction.emoji)
  },
}
