// eslint-disable-next-line import/named
import { Commit, Dispatch } from 'vuex'
import { Channel } from '~/types/ui/server'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'

const $Sounds = new SoundManager()

interface ActionsArguments {
  commit: Commit
  state: any
  dispatch: Dispatch
}

export default {
  setMessages({ commit }: ActionsArguments, messages: any[]) {
    commit('setMessages', messages)
  },
  sendMessage({ commit, state }: ActionsArguments, message: any) {
    if (message.user.address !== state.accounts.active) {
      $Sounds.playSound(Sounds.NEW_MESSAGE)
    }
    commit('sendMessage', message)
  },
  setIsScrollOver({ commit }: ActionsArguments, status: boolean) {
    commit('setIsScrollOver', status)
  },
  setActiveChannel({ commit }: ActionsArguments, channel: Channel) {
    commit('setActiveChannel', channel)
  },
  addReaction({ commit }: ActionsArguments, reaction: any) {
    commit('addReaction', reaction)
    commit('updateRecentReactions', reaction)
  },
}
