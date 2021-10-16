import { Keypair } from '@solana/web3.js'
import Vue from 'vue'
import Crypto from '~/libraries/Crypto/Crypto'
import ServerProgram from '~/libraries/Solana/ServerProgram/ServerProgram'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { ActionsArguments, RootState } from '../store.types'
import {
  AccountsError,
  RegistrationStatus,
  UserRegistrationPayload,
} from './types'

export default {
  /**
   * @method setPin DocsTODO
   * @description
   * @param pin
   * @example
   */
  async setPin({ commit }: ActionsArguments, pin: string) {
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
  async unlock({ commit, state, dispatch }: ActionsArguments, pin: string) {
    const { pinHash, encryptedPhrase } = state.accounts

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
        pin
      )

      await commit('setPhrase', decryptedPhrase)
    }

    commit('unlock', pin)
    dispatch('loadAccount')
  },
  /**
   * @method generateWallet DocsTODO
   * @description
   * @param
   * @example
   */
  async generateWallet({ commit, state }: ActionsArguments) {
    const { pin } = state.accounts

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
      pin
    )

    commit('setEncryptedPhrase', encryptedPhrase)
  },
  /**
   * @method loadAccount DocsTODO
   * @description
   * @param
   * @example
   */
  async loadAccount({ commit, state, dispatch }: ActionsArguments) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const mnemonic = state.accounts.phrase

    if (mnemonic === '') {
      throw new Error(AccountsError.MNEMONIC_NOT_PRESENT)
    }

    await $SolanaManager.initializeFromMnemonic(mnemonic)

    const userAccount = await $SolanaManager.getUserAccount()

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
  },
  /**
   * @method registerUser DocsTODO
   * @description
   * @param userData
   * @example
   */
  async registerUser(
    { commit, dispatch }: ActionsArguments,
    userData: UserRegistrationPayload
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
      commit('setRegistrationStatus', RegistrationStatus.UKNOWN)
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      commit('setRegistrationStatus', RegistrationStatus.UKNOWN)
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const serverProgram: ServerProgram = new ServerProgram($SolanaManager)

    const userInfo = await serverProgram.getUser(userAccount.publicKey)

    if (userInfo) {
      commit('setRegistrationStatus', RegistrationStatus.REGISTERED)
      throw new Error(AccountsError.USER_ALREADY_REGISTERED)
    }

    commit('setRegistrationStatus', RegistrationStatus.SENDING_TRANSACTION)

    await serverProgram.createUser(userData.name, '', userData.status)

    commit('setRegistrationStatus', RegistrationStatus.REGISTERED)

    commit('setActiveAccount', userAccount.publicKey.toBase58())

    // Initialize Encryption Engine
    dispatch('initializeEncryptionEngine', userAccount)
    commit('setUserDetails', {
      username: userData.name,
      status: userData.status,
      photoHash: userData.photoHash,
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
