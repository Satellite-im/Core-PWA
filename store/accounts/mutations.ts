import { AccountsState, RegistrationStatus } from './types'
import { UserRegistrationData } from '~/types/ui/user'

const mutations = {
  setPin(state: AccountsState, pin: string) {
    state.pin = pin
  },
  setPinHash(state: AccountsState, pinHash: string) {
    state.pinHash = pinHash
  },
  unlock(state: AccountsState, pin: string) {
    state.locked = false
    state.pin = pin
  },
  setEncryptedPhrase(state: AccountsState, encryptedPhrase: string) {
    state.encryptedPhrase = encryptedPhrase
  },
  setPhrase(state: AccountsState, decryptedPhrase: string) {
    state.phrase = decryptedPhrase
  },
  setActiveAccount(state: AccountsState, activeAccountPubkey: string) {
    state.active = activeAccountPubkey
  },
  setUserDetails(state: AccountsState, details: UserRegistrationData) {
    state.details = {
      name: details.username,
      status: details.status,
      profilePicture: details.imageURI,
      address: state.active,
      state: 'online',
    }
  },
  setRegistrationStatus(
    state: AccountsState,
    registrationStates: RegistrationStatus
  ) {
    state.registrationStatus = registrationStates
  },
}

export default mutations
