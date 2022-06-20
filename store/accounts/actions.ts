import { Keypair } from '@solana/web3.js'
import Vue from 'vue'
import PeerId, {
  createFromB58String,
  createFromPrivKey,
  createFromPubKey,
} from 'peer-id'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
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
import SolanaAdapter from '~/libraries/BlockchainClient/adapters/SolanaAdapter'
import PhantomAdapter from '~/libraries/BlockchainClient/adapters/PhantomAdapter/PhantomAdapter'
import { Account } from '~/libraries/BlockchainClient/interfaces'

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
    $BlockchainClient.setAdapter(new SolanaAdapter())
    await commit('setAdapter', 'Solana')
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

    if (state.adapter === 'Solana') {
      $BlockchainClient.setAdapter(new SolanaAdapter())
      window.console.log('Using Solana adapter')
    } else {
      $BlockchainClient.setAdapter(new PhantomAdapter())
      window.console.log('Using Phantom adapter')
    }

    const mnemonic = state.phrase

    if (mnemonic === '') {
      throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
    }

    await $BlockchainClient.initFromMnemonic(mnemonic)

    // this will create an error since it responds a keyapair, which is not a valid format for Phantom
    if (!$BlockchainClient.isPayerInitialized) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const payerAccount = $BlockchainClient.payerAccount

    commit('setActiveAccount', payerAccount?.publicKey.toBase58())

    const userInfo = await $BlockchainClient.getCurrentUserInfo()
    if (userInfo === null) {
      throw new Error(AccountsError.USER_NOT_REGISTERED)
    }

    // require the privatekey
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
    userAccount: Account,
  ) {
    // Initialize crypto engine
    const $Crypto: Crypto = Vue.prototype.$Crypto
    $Crypto.init(userAccount)
  },
  async startup(
    { commit, dispatch, rootState, state }: ActionsArguments<AccountsState>,
    payerAccount: Account,
  ) {
    const $Peer2Peer: Peer2Peer = Peer2Peer.getInstance()

    const { initialized: textileInitialized } = rootState.textile

    commit('accounts/setUserPeerId', $Peer2Peer.id, { root: true })
    db.initializeSearchIndexes()

    const { pin } = state
    dispatch('loadTextileAndRelated', {
      initTextile: !textileInitialized && pin,
      payerPublicKey: payerAccount?.publicKey.toBase58(),
    })
    await dispatch('friends/initialize', {}, { root: true })

    // needed the public key
    if (payerAccount.publicKey) {
      dispatch(
        'webrtc/initialize',
        {
          publicKeyInfo: {
            type: 'ed25519',
            publicKey: payerAccount.publicKey.toBytes(),
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

  /**
   * @param method connectPhantom
   * @description changes the adapter to phantom
   **/
  async connectPhantom({ commit, state }: ActionsArguments<AccountsState>) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    $BlockchainClient.setAdapter(new PhantomAdapter())

    await commit('setAdapter', 'Phantom')

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const { pin } = state

    if (!pin) {
      throw new Error(AccountsError.INVALID_PIN)
    }
    await $BlockchainClient.initFromMnemonic()
    if ($BlockchainClient.getConnectionStatus()) {
      window.console.log('Connected to Phantom')
    }

    const userWallet: Account = await $BlockchainClient.account
    userWallet.mnemonic = 'this is a mnemonic fake just for test and mokup'
    await commit('setPhrase', userWallet.mnemonic)

    const encryptedPhrase = await $Crypto.encryptWithPassword(
      userWallet.mnemonic,
      pin,
    )

    commit('setEncryptedPhrase', encryptedPhrase)
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
  const res = await $TextileManager.sharedBucket?.pushFile(
    imageFile,
    imageFile.name,
    () => {},
  )

  return res?.path.root.toString() ?? ''
}

export const exportForTesting = {
  uploadPicture,
}
