import { Keypair } from '@solana/web3.js'
import Vue from 'vue'
import { Update } from '@textile/hub-threads-client'
import {
  AccountsError,
  AccountsState,
  RegistrationStatus,
  UserRegistrationPayload,
} from './types'
import Crypto from '~/libraries/Crypto/Crypto'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import TextileManager from '~/libraries/Textile/TextileManager'
import { ActionsArguments } from '~/types/store/store'
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'
import BlockchainClient from '~/libraries/BlockchainClient'

import { UserThreadData } from '~/types/textile/user'
import { UserInfoManager } from '~/libraries/Textile/UserManager'
import { FilSystem } from '~/libraries/Files/FilSystem'


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

    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const $Crypto: Crypto = Vue.prototype.$Crypto

    await $BlockchainClient.initRandom()
    const userWallet = $BlockchainClient.account

    if (!userWallet.mnemonic) {
      throw new Error(AccountsError.UNABLE_TO_CREATE_MNEMONIC)
    }

    await commit('setPhrase', userWallet.mnemonic)

    const encryptedPhrase = await $Crypto.encryptWithPassword(
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
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const mnemonic = state.phrase

    if (mnemonic === '') {
      throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
    }

    await $BlockchainClient.initFromMnemonic(mnemonic)

    const payerAccount = $BlockchainClient.payerAccount

    if (!payerAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    commit('setActiveAccount', payerAccount?.publicKey.toBase58())

    const userInfo = await $BlockchainClient.getCurrentUserInfo()

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
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    if (!state.initialized) {
      const mnemonic = state.phrase

      if (mnemonic === '') {
        throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
      }

      await $BlockchainClient.initFromMnemonic(mnemonic)
    }

    commit('setRegistrationStatus', RegistrationStatus.IN_PROGRESS)

    const balance = await $BlockchainClient.getBalance()

    if (balance === 0) {
      commit('setRegistrationStatus', RegistrationStatus.FUNDING_ACCOUNT)
      await $BlockchainClient.requestAirdrop()
    }

    const payerAccount = await $BlockchainClient.payerAccount

    if (!payerAccount) {
      commit('setRegistrationStatus', RegistrationStatus.UNKNOWN)
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const userInfo = await $BlockchainClient.getCurrentUserInfo()

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
          wallet: $BlockchainClient.account,
        },
        { root: true },
      )
    }

    const imagePath = await uploadPicture(userData.image)

    await $BlockchainClient.createUser(
      userData.name,
      imagePath,
      userData.status,
    )

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
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const imagePath = await uploadPicture(image)

    await $BlockchainClient.setPhotoHash(imagePath)

    commit('setProfilePicture', imagePath)
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
    { commit, dispatch, rootState, state }: ActionsArguments<AccountsState>,
    payerAccount: Keypair,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const $Peer2Peer: Peer2Peer = Peer2Peer.getInstance()

    const { initialized: textileInitialized } = rootState.textile

    commit('accounts/setUserPeerId', $Peer2Peer.id, { root: true })

    db.initializeSearchIndexes()

    const { pin } = state
    dispatch('loadTextileAndRelated', {
      initTextile: !textileInitialized && pin,
      payerPublicKey: payerAccount?.publicKey.toBase58(),
    })
    dispatch('friends/initialize', {}, { root: true })

    if ($BlockchainClient.payerAccount?.secretKey) {
        dispatch(
        'webrtc/initialize',
        {
          privateKeyInfo: {
            type: 'ed25519',
            privateKey: $BlockchainClient.payerAccount?.secretKey,
          },
          originator: payerAccount.publicKey.toBase58(),
        },
        {
          root: true,
        },
      )
    }

    dispatch('sounds/setMuteSounds', rootState.audio.deafened, { root: true })
  },
  async loadTextileAndRelated(
    { commit, dispatch, rootState, state }: ActionsArguments<AccountsState>,
    {
      initTextile,
      payerPublicKey,
    }: { initTextile?: boolean; payerPublicKey?: string },
  ) {
    if (initTextile) {
      const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
      const { pin } = state
      await dispatch(
        'textile/initialize',
        {
          id: payerPublicKey,
          pass: pin,
          wallet: $BlockchainClient.account,
        },
        { root: true },
      )
    }

    await dispatch('groups/initialize', {}, { root: true })
    await dispatch('textile/listenToThread', {}, { root: true })
    commit('textile/textileInitialized', true, { root: true })
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
