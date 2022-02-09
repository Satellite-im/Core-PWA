import { Keypair } from '@solana/web3.js'
import Vue from 'vue'
import {
  AccountsError,
  AccountsState,
  RegistrationStatus,
  UserRegistrationPayload,
} from './types'
import Crypto from '~/libraries/Crypto/Crypto'
import ServerProgram from '~/libraries/Solana/ServerProgram/ServerProgram'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'

import { ActionsArguments, RootState } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { TextileConfig } from '~/types/textile/manager'

export default {
  /**
   * @method setPin DocsTODO
   * @description
   * @param pin
   * @example
   */
  async setPin({ commit }: ActionsArguments<AccountsState>, pin: string) {
    if (pin.length < 5) {
      throw new Error(AccountsError.PIN_TOO_SHORT)
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const pinHash = await $Crypto.hash(pin)

    // The cleartext version of the pin will not be
    // persisted
    commit('setPin', pin)
    commit('setPinHash', pinHash)
  },
  /**
   * @method unlock DocsTODO
   * @description
   * @param pin
   * @example
   */
  async unlock(
    { commit, state }: ActionsArguments<AccountsState>,
    pin: string,
  ) {
    const { pinHash, encryptedPhrase } = state

    if (pin.length < 5) {
      throw new Error(AccountsError.PIN_TOO_SHORT)
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const computedPinHash = await $Crypto.hash(pin)

    if (computedPinHash !== pinHash) {
      throw new Error(AccountsError.INVALID_PIN)
    }

    if (encryptedPhrase !== '') {
      const decryptedPhrase = await $Crypto.decryptWithPassword(
        encryptedPhrase,
        pin,
      )

      await commit('setPhrase', decryptedPhrase)
    }

    commit('unlock', pin)
  },
  /**
   * @method generateWallet DocsTODO
   * @description
   * @param
   * @example
   */
  async generateWallet({ commit, state }: ActionsArguments<AccountsState>) {
    const { pin } = state

    if (!pin) {
      throw new Error(AccountsError.INVALID_PIN)
    }

    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const $Crypto: Crypto = Vue.prototype.$Crypto

    const solanaWallet = await $SolanaManager.createRandomKeypair()

    if (!solanaWallet.mnemonic) {
      throw new Error(AccountsError.UNABLE_TO_CREATE_MNEMONIC)
    }

    await commit('setPhrase', solanaWallet.mnemonic)

    const encryptedPhrase = await $Crypto.encryptWithPassword(
      solanaWallet.mnemonic,
      pin,
    )

    commit('setEncryptedPhrase', encryptedPhrase)
  },
  /**
   * @method setRecoverMnemonic DocsTODO
   * @description
   * @param mnemonic
   * @example
   */
  async setRecoverMnemonic(
    { commit, state }: ActionsArguments<AccountsState>,
    mnemonic: string,
  ) {
    const { pin } = state

    if (!pin) {
      throw new Error(AccountsError.INVALID_PIN)
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto
    const encryptedPhrase = await $Crypto.encryptWithPassword(mnemonic, pin)

    await commit('setEncryptedPhrase', encryptedPhrase)
  },
  /**
   * @method loadAccount DocsTODO
   * @description
   * @param
   * @example
   */
  async loadAccount({
    commit,
    state,
    dispatch,
  }: ActionsArguments<AccountsState>) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const mnemonic = state.phrase

    if (mnemonic === '') {
      throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
    }

    await $SolanaManager.initializeFromMnemonic(mnemonic)

    const userAccount = $SolanaManager.getUserAccount()

    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    commit('setActiveAccount', userAccount?.publicKey.toBase58())

    const serverProgram: ServerProgram = new ServerProgram($SolanaManager)

    const userInfo = await serverProgram.getUser(userAccount.publicKey)

    if (userInfo === null) {
      throw new Error(AccountsError.USER_NOT_REGISTERED)
    }

    // Initialize Encryption Engine
    dispatch('initializeEncryptionEngine', userAccount)

    commit('setUserDetails', {
      username: userInfo.name,
      ...userInfo,
    })

    commit('prerequisites/setAccountsReady', true, { root: true })

    // TODO: move this logic into a startup action
    // Initialize textile
    const { pin } = state
    const textileConfig = {
      id: userAccount?.publicKey.toBase58(),
      pass: pin,
      wallet: $SolanaManager.getMainSolanaWalletInstance(),
    }
    dispatch('textile/initialize', textileConfig, { root: true })
    dispatch('bucket/initialize', textileConfig, { root: true })

    // Initialize WebRTC with our ID
    dispatch('webrtc/initialize', userAccount.publicKey.toBase58(), {
      root: true,
    })

    // Dispatch an action to fetch friends and friends requests
    dispatch('friends/fetchFriends', {}, { root: true })
    dispatch('friends/fetchFriendRequests', {}, { root: true })
    dispatch('friends/subscribeToFriendsEvents', {}, { root: true })
  },
  /**
   * @method registerUser DocsTODO
   * @description
   * @param userData
   * @example
   */
  async registerUser(
    { commit, state, dispatch }: ActionsArguments<AccountsState>,
    userData: UserRegistrationPayload,
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    commit('setRegistrationStatus', RegistrationStatus.IN_PROGRESS)

    const balance = await $SolanaManager.getCurrentAccountBalance()

    if (balance === 0) {
      commit('setRegistrationStatus', RegistrationStatus.FUNDING_ACCOUNT)
      await $SolanaManager.requestAirdrop()
    }

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      commit('setRegistrationStatus', RegistrationStatus.UNKNOWN)
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      commit('setRegistrationStatus', RegistrationStatus.UNKNOWN)
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const serverProgram: ServerProgram = new ServerProgram($SolanaManager)

    const userInfo = await serverProgram.getUser(userAccount.publicKey)

    if (userInfo) {
      commit('setRegistrationStatus', RegistrationStatus.REGISTERED)
      throw new Error(AccountsError.USER_ALREADY_REGISTERED)
    }

    commit('setRegistrationStatus', RegistrationStatus.SENDING_TRANSACTION)

    // only init textile if we need to push an image to bucket
    if (userData.image) {
      const { pin } = state
      await dispatch(
        'textile/initialize',
        {
          id: userAccount?.publicKey.toBase58(),
          pass: pin,
          wallet: $SolanaManager.getMainSolanaWalletInstance(),
        },
        { root: true },
      )
    }

    const imagePath = await uploadPicture(userData.image)

    await serverProgram.createUser(userData.name, imagePath, userData.status)

    commit('setRegistrationStatus', RegistrationStatus.REGISTERED)

    commit('setActiveAccount', userAccount.publicKey.toBase58())

    // Initialize Encryption Engine
    dispatch('initializeEncryptionEngine', userAccount)
    commit('setUserDetails', {
      username: userData.name,
      status: userData.status,
      photoHash: imagePath,
      address: userAccount.publicKey.toBase58(),
    })
  },
  /**
   * @method initializeEncryptionEngine DocsTODO
   * @description
   * @param userAccount
   * @example
   */
  async initializeEncryptionEngine(_: RootState, userAccount: Keypair) {
    // Initialize crypto engine
    const $Crypto: Crypto = Vue.prototype.$Crypto
    await $Crypto.init(userAccount)
  },
}

/**
 * @method uploadPicture
 * @description helper function to upload image to textile if needed
 * @param image data string of uploaded image
 * @returns textile hash of image, or '' if no image is present
 */
async function uploadPicture(image: string) {
  if (!image) {
    return ''
  }

  // convert data string image to File
  const imageFile: File = await fetch(image)
    .then((res) => res.blob())
    .then((blob) => {
      return new File([blob], 'profile.jpeg', { type: 'image/jpeg' })
    })

  const $TextileManager: TextileManager = Vue.prototype.$TextileManager
  $TextileManager.bucketManager?.getBucket()
  const result = await $TextileManager.bucketManager?.pushFile(
    imageFile,
    imageFile.name,
  )

  return result?.path.root.toString() ?? ''
}
