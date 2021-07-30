import Vue from 'vue'
import { Commit } from 'vuex'
import { AccountsError } from './types'
import Crypto from '~/utilities/Crypto/Crypto'

interface ActionsArguments {
  commit: Commit
  state: any
}

export default {
  async setPin({ commit }: ActionsArguments, pin: string) {
    commit('setAccountError', '')

    if (pin.length < 5) {
      commit('setAccountError', AccountsError.PIN_TOO_SHORT)
      return
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const pinHash = await $Crypto.hash(pin)

    commit('setPinHash', pinHash)
    commit('unlock')
  },
  async unlock({ commit, state }: ActionsArguments, pin: string) {
    commit('setAccountError', '')

    if (pin.length < 5) {
      commit('setAccountError', AccountsError.PIN_TOO_SHORT)
      return
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const pinHash = await $Crypto.hash(pin)

    if (state.accounts.pinHash === pinHash) {
      commit('unlock')
    } else {
      commit('setAccountError', AccountsError.INVALID_PIN)
    }
  },
}
