/* eslint-disable no-console */
import { Keypair } from '@solana/web3.js'
import Vue from 'vue'
import {
  AccountsError,
  AccountsState,
  RegistrationStatus,
  UserRegistrationPayload,
} from './types'
import Crypto from '~/libraries/Crypto/Crypto'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ActionsArguments } from '~/types/store/store'
import BlockchainClient from '~/libraries/BlockchainClient'
import logger from '~/plugins/local/logger'
import PhantomAdapter from '~/libraries/BlockchainClient/adapters/Phantom/PhantomAdapter'
import IdentityManager from '~/libraries/Iridium/IdentityManager'
import SolanaAdapter from '~/libraries/BlockchainClient/adapters/SolanaAdapter'

export default {
  /**
   * @method setPin
   * @description sets the user pin password and stores its
   * hash inside the Vuex state
   * @param pin the chosen pin password
   * @example
   * ```typescript
   * this.$store.dispatch('accounts/setPin', 'myPassword123')
   * ```
   */
  async setPin({ commit }: ActionsArguments<AccountsState>, pin: string) {
    if (pin.length < 5) {
      throw new Error(AccountsError.PIN_TOO_SHORT)
    }

    const pinHash = await Crypto.hash(pin)

    // The cleartext version of the pin will not be persisted
    commit('setPin', pin)
    commit('setPinHash', pinHash)
  },
  /**
   * @method unlock
   * @description performs all the actions to unlock the app by
   * decrypting the wallet information
   * @param pin pin password in use
   * @example
   * ```typescript
   * this.$store.dispatch('accounts/unlock', 'myPassword123')
   * ```
   */
  async unlock(
    { commit, state }: ActionsArguments<AccountsState>,
    pin: string,
  ) {
    const { pinHash, encryptedPhrase } = state

    if (pin.length < 5) {
      throw new Error(AccountsError.PIN_TOO_SHORT)
    }

    const computedPinHash = await Crypto.hash(pin)

    if (computedPinHash !== pinHash) {
      throw new Error(AccountsError.INVALID_PIN)
    }

    if (encryptedPhrase !== '') {
      const decryptedPhrase = await Crypto.decryptWithPassword(
        encryptedPhrase,
        pin,
      )

      await commit('setPhrase', decryptedPhrase)
    }

    commit('unlock', pin)
  },
  /**
   * @method generateWallet
   * @description Generates a new Solana hierarchical wallet
   * @example
   * ```typescript
   * this.$store.dispatch('accounts/generateWallet')
   * ```
   */
  async generateWallet({ commit, state }: ActionsArguments<AccountsState>) {
    const { pin } = state

    if (!pin) {
      throw new Error(AccountsError.INVALID_PIN)
    }

    await commit('setAdapter', 'Solana')
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    $BlockchainClient.setAdapter(new SolanaAdapter())

    await $BlockchainClient.initRandom()
    const userWallet = $BlockchainClient.account

    if (!userWallet.mnemonic) {
      throw new Error(AccountsError.UNABLE_TO_CREATE_MNEMONIC)
    }

    await commit('setPhrase', userWallet.mnemonic)

    const { pinHash } = state
    const entropyMessage = IdentityManager.generateEntropyMessage(
      $BlockchainClient.account.publicKey.toBase58(),
      pinHash,
    )
    commit('setEntropy', entropyMessage)

    const encryptedPhrase = await Crypto.encryptWithPassword(
      userWallet.mnemonic,
      pin,
    )

    commit('setEncryptedPhrase', encryptedPhrase)
  },
  /**
   * @method setRecoverMnemonic
   * @description Encrypts the wallet mnemonic phrase using the user pin
   * password and stores it inside Vuex store
   * @param mnemonic the mnemonic phrase to store
   * @example
   * ```typescript
   * this.$store.dispatch('accounts/setRecoverMnemonic','my seed phrase')
   * ```
   */
  async setRecoverMnemonic(
    { commit, state }: ActionsArguments<AccountsState>,
    mnemonic: string,
  ) {
    const { pin } = state

    if (!pin) {
      throw new Error(AccountsError.INVALID_PIN)
    }

    const encryptedPhrase = await Crypto.encryptWithPassword(mnemonic, pin)

    await commit('setEncryptedPhrase', encryptedPhrase)
  },
  /**
   * @method loadAccount
   * @description Performs all the action needed to retrieve the user account
   * from Solana
   * @example
   * ```typescript
   * this.$store.dispatch('accounts/loadAccount')
   * ```
   */
  async loadAccount({
    commit,
    state,
    dispatch,
  }: ActionsArguments<AccountsState>) {
    console.info('loadAccount')
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    if (state.adapter === 'Solana') {
      $BlockchainClient.setAdapter(new SolanaAdapter())
      window.console.log('Using Solana adapter')
    } else {
      $BlockchainClient.setAdapter(new PhantomAdapter())
      window.console.log('Using Phantom adapter')
    }
    const mnemonic = state.phrase
    if (mnemonic === '') {
      console.info('empty mnemonic')
      throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
    }

    await $BlockchainClient.initFromMnemonic(mnemonic)

    if (!$BlockchainClient.isPayerInitialized) {
      console.info('payer not initialized')
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    if (!iridium.ready) {
      console.info('initializing iridium')
      const { entropyMessage } = state
      const entropy = await $BlockchainClient.signMessage(entropyMessage)
      await dispatch('iridium/initializeFromEntropy', entropy, {
        root: true,
      })
    }

    commit('setActiveAccount', iridium.connector?.id)
    console.info('fetching user info')
    const userInfo = await iridium.profile?.get()
    if (!userInfo?.did) {
      console.info('user not registered', userInfo)
      throw new Error(AccountsError.USER_NOT_REGISTERED)
    }

    console.info('user registered, dispatching')
    commit('setUserDetails', {
      username: userInfo.name,
      ...userInfo,
    })
    commit('setRegistrationStatus', RegistrationStatus.REGISTERED)
    dispatch('startup')
  },
  /**
   * @method registerUser
   * @description Registers a new user on the Solana blockchain
   * @param userData User information to register
   * @example
   * ```typescript
   * this.$store.dispatch(
   *  'accounts/registerUser',
   *  {
   *    name: 'My Name',
   *    image: 'linkToMyImage',
   *    status: 'My amazing status message ????'
   *  }
   * );
   * ```
   */
  async registerUser(
    { commit, state, dispatch }: ActionsArguments<AccountsState>,
    userData: UserRegistrationPayload,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    if (!state.initialized) {
      const mnemonic = state.phrase

      if (mnemonic === '') {
        throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
      }

      await $BlockchainClient.initFromMnemonic(mnemonic)
    }

    commit('setRegistrationStatus', RegistrationStatus.IN_PROGRESS)

    const walletAccount = await $BlockchainClient.payerAccount
    if (!walletAccount) {
      commit('setRegistrationStatus', RegistrationStatus.UNKNOWN)
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const userInfo = await iridium.profile?.get()
    if (userInfo?.id) {
      commit('setRegistrationStatus', RegistrationStatus.REGISTERED)
      throw new Error(AccountsError.USER_ALREADY_REGISTERED)
    }

    commit('setRegistrationStatus', RegistrationStatus.SENDING_TRANSACTION)

    const imagePath = await uploadPicture(userData.image)
    const profile = {
      did: iridium.connector?.id,
      peerId: iridium.connector?.peerId,
      name: userData.name,
      status: userData.status,
      photoHash: imagePath,
    }
    await iridium.profile?.set('', profile)
    commit('setRegistrationStatus', RegistrationStatus.REGISTERED)
    commit('setActiveAccount', iridium.connector?.id)
    commit('setUserDetails', {
      username: userData.name,
      status: userData.status,
      photoHash: imagePath,
      address: walletAccount.publicKey.toBase58(),
    })
    dispatch('startup', walletAccount)
  },

  /**
   * @method updateProfilePhoto
   * @description update profile photo of the user on the Solana blockchain
   * @param image
   * @example
   * ```typescript
   * this.$store.dispatch(
   *  'accounts/updateProfilePhoto', image
   * );
   * ```
   */
  async updateProfilePhoto(
    { commit, state, dispatch }: ActionsArguments<AccountsState>,
    image: string,
  ) {
    const imagePath = await uploadPicture(image)
    await iridium.profile?.set('/photoHash', imagePath)
    commit('setPhotoHash', imagePath)
  },

  /**
   * @method initializeEncryptionEngine
   * @description Initializes the Crypto class with the current user keypair
   * @param userAccount keypair of the current user
   * @example
   * ```typescript
   * this.$store.dispatch('accounts/initializeEncriptionEngin', currentUserAccount)
   * ```
   */
  async initializeEncryptionEngine(
    _: ActionsArguments<AccountsState>,
    userAccount: Keypair,
  ) {
    // Initialize crypto engine
    const $Crypto: Crypto = Vue.prototype.$Crypto
    await $Crypto.init(userAccount)
  },

  async startup({
    dispatch,
    rootState,
    state,
  }: ActionsArguments<AccountsState>) {
    db.initializeSearchIndexes()

    const { pin } = state
    await dispatch('loadIridium', {
      pin,
    })

    if (!iridium.connector?.peerId) {
      return
    }

    dispatch(
      'webrtc/initialize',
      {
        privateKeyInfo: {
          type: 'ed25519',
          privateKey: iridium.connector?.peerId,
        },
        originator: iridium.connector?.peerId,
      },
      {
        root: true,
      },
    )

    dispatch('sounds/setMuteSounds', rootState.audio.deafened, { root: true })
  },
  async loadIridium({ dispatch, state }: ActionsArguments<AccountsState>) {
    if (!iridium.ready) {
      logger.log(
        'accounts/loadIridium',
        'Loading Iridium from accounts startup',
      )
      const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
      const { entropyMessage } = state
      const entropy = await $BlockchainClient.signMessage(entropyMessage)
      await dispatch('iridium/initializeFromEntropy', entropy, { root: true })
    }

    await dispatch('groups/initialize', {}, { root: true })
  },
  async connectWallet({
    commit,
    dispatch,
    state,
  }: ActionsArguments<AccountsState>) {
    const { pin } = state

    if (!pin) {
      throw new Error(AccountsError.INVALID_PIN)
    }

    commit('setAdapter', 'Phantom')
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    $BlockchainClient.setAdapter(new PhantomAdapter())
    await $BlockchainClient.initFromMnemonic()

    const { pinHash } = state
    const entropyMessage = IdentityManager.generateEntropyMessage(
      $BlockchainClient.account.publicKey.toBase58(),
      pinHash,
    )
    commit('setEntropy', entropyMessage)

    const fakeMnemonic = 'fake mnemonic to bypass checks'
    commit('setPhrase', 'fake mnemonic to bypass checks')
    const encryptedPhrase = await Crypto.encryptWithPassword(fakeMnemonic, pin)

    commit('setEncryptedPhrase', encryptedPhrase)
  },
}

/**
 * @method uploadPicture
 * @description helper function to upload image to textile if needed
 * @param image data string of uploaded image
 * @returns IPFS CID of image, or '' if no image is present
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
  // store image in IPFS
  return iridium.connector?.store(imageFile)
}

export const exportForTesting = {
  uploadPicture,
}
