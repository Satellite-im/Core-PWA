import { NuxtState } from '@nuxt/types/app'
import { AccountsError } from './types'

const mutations = {
  setPinHash(state: NuxtState, pinHash: string) {
    state.accounts.pinHash = pinHash
  },
  unlock(state: NuxtState) {
    state.accounts.locked = false
  },
  setAccountError(state: NuxtState, error: AccountsError) {
    state.accounts.error = error
  },
}

export default mutations
