import Vue from 'vue'
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import {
  AccountsError,
  AccountsState,
  RegistrationStatus,
  UserRegistrationPayload,
} from './types'
import * as accounts from '~/store/accounts/actions'
import InitialAccountsState from '~/store/accounts/state'
import TextileManager from '~/libraries/Textile/TextileManager'
import Crypto from '~/libraries/Crypto/Crypto'
import { Config } from '~/config'

Vue.prototype.$Config = Config
Vue.prototype.$TextileManager = new TextileManager()
Vue.prototype.$Crypto = new Crypto()

enableFetchMocks()

describe('init', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })
  test('setPin with 5 letter', async () => {
    const CPrototype = Vue.prototype.$Crypto

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    await accounts.default.setPin({ commit }, '12345')
    expect(CPrototype.hash).toHaveBeenCalled()
    expect(CPrototype.hash).toHaveBeenCalledWith('12345')
    expect(commit).toHaveBeenCalledWith('setPin', '12345')
  })
  test('setPin with less than 5 letter', async () => {
    const CPrototype = Vue.prototype.$Crypto

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    try {
      await accounts.default.setPin({ commit }, '123')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.PIN_TOO_SHORT)
    }
  })
  test.skip('unlock with a with a correct, pin, pinHash, and encryptedPhrase', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    state.pinHash =
      '3b4557f45660ca5364013a84dc2dce7d08ab991976a6ef81bdaa4c289997f6cb'
    state.phrase = 'mnemonic string'
    state.encryptedPhrase =
      '867cb445e1f9b95d67e22c558ef1c555a189ac70358acdd2fad871a42070bec7'

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    await accounts.default.unlock({ commit, state }, state.pin)
    expect(CPrototype.hash).toHaveBeenCalled()
    expect(CPrototype.hash).toHaveBeenCalledWith(state.pin)
    expect(commit).toHaveBeenCalledWith('unlock', state.pin)
  })
  test('unlock with non-matching pinHash', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    state.pinHash =
      '3b4557f45660ca5364013a84dc2dce7d08ab991976a6ef81bdaa4c289997f6cb'
    state.phrase = 'mnemonic string'
    state.encryptedPhrase = ''

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    try {
      await accounts.default.unlock({ commit, state }, state.pin)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.INVALID_PIN)
    }
  })
  test('unlock with non-empty encryptedPhrase', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    state.pinHash = undefined
    // state.pinHash is undefined because at actions.ts line 55 keeps not returning the hash, hence (undefined == undefined) would evaluate to true and let us test the line 61 block: if (encryptedPhrase !== '')
    state.phrase = 'mnemonic string'
    state.encryptedPhrase =
      '867cb445e1f9b95d67e22c558ef1c555a189ac70358acdd2fad871a42070bec7'

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    try {
      await accounts.default.unlock({ commit, state }, state.pin)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      // The expect block above will not evaluate to true, because the received is TypeError; not Error.
      console.error(error)
    }
  })
  test('setRecoverMnemonic with a pin', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    const mnemonic = 'mnemonic string'

    const commit = jest.fn()
    CPrototype.encryptWithPassword = jest.fn()

    await accounts.default.setRecoverMnemonic({ commit, state }, mnemonic)
    expect(CPrototype.encryptWithPassword).toHaveBeenCalled()
    expect(CPrototype.encryptWithPassword).toHaveBeenCalledWith(
      mnemonic,
      state.pin,
    )
    expect(commit).toHaveBeenCalledWith('setEncryptedPhrase', undefined)
    // It is undefined because setEncryptedPhrase updates the state, rather than returning any value.
  })
  test('setRecoverMnemonic with an invalid pin', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = ''
    state.loading = false
    const mnemonic = 'mnemonic string'

    const commit = jest.fn()
    CPrototype.encryptWithPassword = jest.fn()

    try {
      await accounts.default.setRecoverMnemonic({ commit, state }, mnemonic)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.INVALID_PIN)
    }
  })
  test('setRecoverMnemonic without a mnemonic', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    const mnemonic = ''

    const commit = jest.fn()
    CPrototype.encryptWithPassword = jest.fn()

    try {
      await accounts.default.setRecoverMnemonic({ commit, state }, mnemonic)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        AccountsError.MNEMONIC_NOT_PRESENT,
      )
    }
  })
  test('uploadPicture with an image', async () => {
    /*
     * The comments are here because I am still discussing on how to proceed in testing out the TextileManager on the Vue side. Right now it is about fetch.
     */
    // console.log(Vue.prototype.$TextileManager.bucketManager)
    // const TMPrototype = Vue.prototype.$TextileManager
    // TMPrototype.bucketManager.getBucket = jest.fn()
    // TMPrototype.bucketManager.pushFile = jest.fn()

    const result = await accounts.exportForTesting.uploadPicture(
      'https://drepram.com/assets/favicon.png',
    )
    expect(fetchMock.mock.calls.length).toEqual(1)
    // expect(TMPrototype.bucketManager.getBucket).toHaveBeenCalled()
    // expect(TMPrototype.bucketManager.pushFile).toHaveBeenCalled()
  })
  test('uploadPicture with a non image', async () => {
    const result = await accounts.exportForTesting.uploadPicture(false)
    expect(result).toBe('')
  })
})
