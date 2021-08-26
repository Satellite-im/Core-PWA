import Vue from 'vue'
import { Commit, Dispatch } from 'vuex'
import { AccountsError } from './types'
import Crypto from '~/utilities/Crypto/Crypto'
import SolanaManager from '~/utilities/SolanaManager/SolanaManager'

interface ActionsArguments {
  commit: Commit
  state: any
  dispatch: Dispatch
}

export default {
  async setPin({ commit, dispatch }: ActionsArguments, pin: string) {
    commit('setAccountError', '')

    if (pin.length < 5) {
      commit('setAccountError', AccountsError.PIN_TOO_SHORT)
      return
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const pinHash = await $Crypto.hash(pin)

    // Wait for the pinHash to be stored in the state
    await commit('setPinHash', pinHash)

    // Dispatch the unlock action in order to reuse the same
    // decryption logic for the mnemonic phrase
    dispatch('unlock', pin)
  },
  async unlock({ commit, state }: ActionsArguments, pin: string) {
    const { pinHash, encryptedPhrase } = state.accounts

    commit('setAccountError', '')

    if (pin.length < 5) {
      commit('setAccountError', AccountsError.PIN_TOO_SHORT)
      return
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const computedPinHash = await $Crypto.hash(pin)

    if (computedPinHash !== pinHash) {
      commit('setAccountError', AccountsError.INVALID_PIN)
      return
    }

    if (encryptedPhrase !== '') {
      const decryptedPhrase = await $Crypto.decryptWithPassword(
        encryptedPhrase,
        pin
      )

      await commit('setPhrase', decryptedPhrase)
    }

    commit('unlock', pin)
  },
  async generateWallet({ commit, state }: ActionsArguments) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const $Crypto: Crypto = Vue.prototype.$Crypto

    commit('setLoading', true)

    const solanaWallet = await $SolanaManager.createRandomKeypair()

    if (!solanaWallet.mnemonic) {
      commit('setLoading', false)
      return
    }

    await commit('setPhrase', solanaWallet.mnemonic)

    const encryptedPhrase = await $Crypto.encryptWithPassword(
      solanaWallet.mnemonic,
      state.accounts.pin
    )

    commit('setEncryptedPhrase', encryptedPhrase)

    commit('setLoading', false)
  },
}
