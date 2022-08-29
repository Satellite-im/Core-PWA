import { AccountsState, RegistrationStatus } from './types'
import { UserRegistrationData } from '~/types/ui/user'
import { User } from '~/libraries/BlockchainClient/interfaces'

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
      state.details.profilePicture = image
    }
  },
  setUserDetails(state: AccountsState, details: UserRegistrationData) {
    state.details = {
      name: details.username,
      status: details.status,
      profilePicture: details.photoHash,
      address: state.active,
      state: 'online',
      lastUpdate: Date.now(),
    }
  },
  setUserPeerId(state: AccountsState, peerId: string) {
    if (state.details) {
      state.details = {
        ...state.details,
        peerId,
      }
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
