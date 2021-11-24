import { AccountsState, RegistrationStatus } from './types'
import { UserRegistrationData } from '~/types/ui/user'

const mutations = {
  setPin(state: AccountsState, pin: string) {
    state.pin = pin
  },
  setStorePin(state: AccountsState, storePin: boolean) {
    state.storePin = storePin
  },
  setPinHash(state: AccountsState, pinHash: string) {
    state.pinHash = pinHash
  },
  unlock(state: AccountsState, pin: string) {
    state.locked = false
    state.pin = pin
  },
  lock(state: AccountsState) {
    state.locked = true
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
  updateMailboxId(state: AccountsState, mailboxId: string) {
    if (state.details) {
      state.details = {
        ...state.details,
        mailboxId,
      }
    }
  },
  updateTextilePubkey(state: AccountsState, textilePubkey: string) {
    if (state.details) {
      state.details = {
        ...state.details,
        textilePubkey,
      }
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
