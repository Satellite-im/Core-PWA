import { RootState } from '../store.types'

const getters = {
  getPinHash: (state: RootState): string => {
    return state.accounts.pinHash
  },
  getEncryptedPhrase: (state: RootState) => {
    return state.accounts.encryptedPhrase
  },
  getPhrase: (state: RootState) => {
    return state.accounts.phrase
  },
  getRegistrationStatus: (state: RootState) => {
    return state.accounts.registrationStatus
  },
  getActiveAccount: (state: RootState) => {
    return state.accounts.active
  },
}

export default getters
