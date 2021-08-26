import { NuxtState } from '@nuxt/types/app'
import { AccountsError } from './types'

const mutations = {
  setPinHash(state: NuxtState, pinHash: string) {
    state.accounts.pinHash = pinHash
  },
  unlock(state: NuxtState, pin: string) {
    state.accounts.locked = false
    state.accounts.pin = pin
  },
  setAccountError(state: NuxtState, error: AccountsError) {
    state.accounts.error = error
  },
  setEncryptedPhrase(state: NuxtState, encryptedPhrase: string) {
    state.accounts.encryptedPhrase = encryptedPhrase
  },
  setPhrase(state: NuxtState, decryptedPhrase: string) {
    state.accounts.phrase = decryptedPhrase
  },
  setLoading(state: NuxtState, loading: boolean) {
    state.accounts.loading = loading
  },
}

export default mutations
