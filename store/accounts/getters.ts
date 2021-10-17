import { AccountsState } from './types'

const getters = {
  getPinHash: (state: AccountsState): string => {
    return state.pinHash
  },
  getEncryptedPhrase: (state: AccountsState) => {
    return state.encryptedPhrase
  },
  getPhrase: (state: AccountsState) => {
    return state.phrase
  },
  getRegistrationStatus: (state: AccountsState) => {
    return state.registrationStatus
  },
  getActiveAccount: (state: AccountsState) => {
    return state.active
  },
}

export default getters
