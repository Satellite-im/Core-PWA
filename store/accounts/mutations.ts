import { AccountsState, RegistrationStatus } from './types'
import { User } from '~/libraries/Iridium/users/types'

const mutations = {
  setPin(state: AccountsState, pin: string) {
    state.pin = pin
  },
  setStorePin(state: AccountsState, storePin: boolean) {
    state.storePin = storePin
  },
  setRegistry(state: AccountsState, registry: boolean) {
    state.registry = registry
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
    state.initialized = true
  },
  setProfilePicture(state: AccountsState, image: string) {
    if (state.details) {
      state.details.photoHash = image
    }
  },
  setUserDetails(state: AccountsState, details: User) {
    state.details = {
      did: details.did,
      name: details.name,
      status: details.status,
      photoHash: details.photoHash,
    }
    state.welcomePopup = true
  },
  dismissWelcome(state: AccountsState) {
    state.welcomePopup = false
  },
  setUserPeerId(state: AccountsState, peerId: string) {
    if (state.details) {
      state.details = {
        ...state.details,
        peerId,
      }
    }
  },
  setRegistrationStatus(
    state: AccountsState,
    registrationStates: RegistrationStatus,
  ) {
    state.registrationStatus = registrationStates
  },
  setLastVisited(state: AccountsState, lastVisited: string) {
    state.lastVisited = lastVisited
  },
  setAdapter(state: AccountsState, adapter: string) {
    state.adapter = adapter
  },
  setEntropy(state: AccountsState, entropyMessage: string) {
    state.entropyMessage = entropyMessage
  },
}

export default mutations
