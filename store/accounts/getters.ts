import { AccountsState } from './types'

const getters = {
  getEncryptedPhrase: (state: AccountsState) => {
    return state.encryptedPhrase
  },
  getRegistrationStatus: (state: AccountsState) => {
    return state.registrationStatus
  },
  getActiveAccount: (state: AccountsState) => {
    return state.active
  },
}

export default getters
