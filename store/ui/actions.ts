// eslint-disable-next-line import/named
import { Commit, Dispatch } from 'vuex'
import { Channel } from '~/types/ui/server'

interface ActionsArguments {
  commit: Commit
  state: any
  dispatch: Dispatch
}

export default {
  setMessages({ commit }: ActionsArguments, messages: any[]) {
    commit('setMessages', messages)
  },
  sendMessage({ commit }: ActionsArguments, message: any) {
    commit('sendMessage', message)
  },
  setIsScrollOver({ commit }: ActionsArguments, status: boolean) {
    commit('setIsScrollOver', status)
  },
  setActiveChannel({ commit }: ActionsArguments, channel: Channel) {
    commit('setActiveChannel', channel)
  }
}
