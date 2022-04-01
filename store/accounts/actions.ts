import { Keypair } from '@solana/web3.js'
import Vue from 'vue'
import {
  AccountsError,
  AccountsState,
  RegistrationStatus,
  UserRegistrationPayload,
} from './types'
import Crypto from '~/libraries/Crypto/Crypto'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'

import { ActionsArguments, RootState } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'

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

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const pinHash = await $Crypto.hash(pin)

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

    const $Crypto: Crypto = Vue.prototype.$Crypto
    const encryptedPhrase = await $Crypto.encryptWithPassword(mnemonic, pin)

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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const mnemonic = state.phrase

    if (mnemonic === '') {
      throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
    }

    await $SolanaManager.initializeFromMnemonic(mnemonic)

    const payerAccount = $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    commit('setActiveAccount', payerAccount?.publicKey.toBase58())

    const usersProgram: UsersProgram = new UsersProgram($SolanaManager)

    const userInfo = await usersProgram.getCurrentUserInfo()

    if (userInfo === null) {
      throw new Error(AccountsError.USER_NOT_REGISTERED)
    }

    dispatch('initializeEncryptionEngine', payerAccount)

    commit('setUserDetails', {
      username: userInfo.name,
      ...userInfo,
    })

    dispatch('startup', payerAccount)
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
   *    status: 'My amazing status message 🚀'
   *  }
   * );
   * ```
   */
  async registerUser(
    { commit, state, dispatch }: ActionsArguments<AccountsState>,
    userData: UserRegistrationPayload,
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    if (!state.initialized) {
      const mnemonic = state.phrase

      if (mnemonic === '') {
        throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
      }

      await $SolanaManager.initializeFromMnemonic(mnemonic)
    }

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

    const usersProgram: UsersProgram = new UsersProgram($SolanaManager)

    const userInfo = await usersProgram.getCurrentUserInfo()

    if (userInfo) {
      commit('setRegistrationStatus', RegistrationStatus.REGISTERED)
      throw new Error(AccountsError.USER_ALREADY_REGISTERED)
    }

    commit('setRegistrationStatus', RegistrationStatus.SENDING_TRANSACTION)
    /* textilePubKey is generated first before setting account details if user is registered with avatar */
    let preGeneratedTextilePubKey = null
    // only init textile if we need to push an image to bucket
    if (userData.image) {
      const { pin } = state
      preGeneratedTextilePubKey = await dispatch(
        'textile/initialize',
        {
          id: payerAccount?.publicKey.toBase58(),
          pass: pin,
          wallet: $SolanaManager.getMainSolanaWalletInstance(),
        },
        { root: true },
      )
    }

    const imagePath = await uploadPicture(userData.image)

    await usersProgram.create(userData.name, imagePath, userData.status)

    commit('setRegistrationStatus', RegistrationStatus.REGISTERED)

    commit('setActiveAccount', payerAccount.publicKey.toBase58())

    dispatch('initializeEncryptionEngine', payerAccount)

    commit('setUserDetails', {
      username: userData.name,
      status: userData.status,
      photoHash: imagePath,
      address: payerAccount.publicKey.toBase58(),
    })
    /* reset textilePubKey after setting user detail if it is not set properly */
    if (preGeneratedTextilePubKey && !state.details?.textilePubkey)
      commit('updateTextilePubkey', preGeneratedTextilePubKey)
    dispatch('startup', payerAccount)
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
  async startup(
    { dispatch, rootState, state }: ActionsArguments<AccountsState>,
    payerAccount: Keypair,
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const { initialized: textileInitialized } = rootState.textile
    const { initialized: webrtcInitialized } = rootState.webrtc

    await db.initializeSearchIndexes()

    const { pin } = state
    if (!textileInitialized && pin) {
      dispatch(
        'textile/initialize',
        {
          id: payerAccount?.publicKey.toBase58(),
          pass: pin,
          wallet: $SolanaManager.getMainSolanaWalletInstance(),
        },
        { root: true },
      )
    }

    if (!webrtcInitialized && $SolanaManager.payerAccount?.secretKey) {
      dispatch(
        'webrtc/initialize',
        { type: 'ed25519', privateKey: $SolanaManager.payerAccount?.secretKey },
        {
          root: true,
        },
      )
    }

    dispatch('sounds/setMuteSounds', rootState.audio.deafened, { root: true })
    dispatch('friends/initialize', {}, { root: true })
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

export const exportForTesting = {
  uploadPicture,
}
