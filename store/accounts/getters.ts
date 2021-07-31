import { NuxtState } from '@nuxt/types/app'

const getters = {
  getPinHash: (state: NuxtState) => {
    return state.accounts.pinHash
  },
  getError: (state: NuxtState) => {
    return state.accounts.error
  },
}

export default getters
