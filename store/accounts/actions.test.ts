import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import Vue from 'vue'
import { AccountsError } from './types'
import { Config } from '~/config'
import Crypto from '~/libraries/Crypto/Crypto'
import TextileManager from '~/libraries/Textile/TextileManager'
import * as accounts from '~/store/accounts/actions'
import InitialAccountsState from '~/store/accounts/state'

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

    await expect(async () => {
      await accounts.default.unlock({ commit, state }, state.pin)
    }).rejects.toThrowError(AccountsError.INVALID_PIN)
  })
  test('unlock with 4 length pin', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = {
      storePin: false,
      locked: false,
      error: '',
      pinHash:
        'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
      active: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
      gasPrice: '',
      phrase:
        'flip use save jealous brass link card express degree tip cube flame',
      encryptedPhrase:
        'AhJ3ybxW6ZnjiX5RSoNUXGvDVkMRFHiMYeYTvgkBMUETCK3YoCmBRnGFQfbM0sCsWJauMUFvIIxucgDbrLcYK5PK/rL00VBlLilQp1dZwGfiEGrE0br4DTWCjkvefwtL',
      loading: false,
      registered: false,
      registrationStatus: 'unknown',
      lastVisited: '/chat/direct/HFi9WT7vwxhDBi2MNfGUkrCrQrUkVdDKjuhix1RwnVG7',
      details: {
        address: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
        name: 'asdasdsa',
        profilePicture: '',
        state: 'online',
        status: 'dasdad',
        textilePubkey:
          'bbaareifiszb2kb2mejsgng4d52g2y2fxxuhhgnblixjqsvdatptpn7t6dy',
      },
      pin: '?{fD', // length is 3, rather than the minimum that is 5
    }

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    const result = async () => {
      await accounts.default.unlock({ commit, state }, state.pin)
    }

    expect(result).rejects.toThrowError(AccountsError.PIN_TOO_SHORT)
  })
  test('unlock with set phrase', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = {
      storePin: false,
      locked: false,
      error: '',
      pinHash:
        'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
      active: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
      gasPrice: '',
      phrase:
        'flip use save jealous brass link card express degree tip cube flame',
      encryptedPhrase:
        'AhJ3ybxW6ZnjiX5RSoNUXGvDVkMRFHiMYeYTvgkBMUETCK3YoCmBRnGFQfbM0sCsWJauMUFvIIxucgDbrLcYK5PK/rL00VBlLilQp1dZwGfiEGrE0br4DTWCjkvefwtL',
      loading: false,
      registered: false,
      registrationStatus: 'unknown',
      lastVisited: '/chat/direct/HFi9WT7vwxhDBi2MNfGUkrCrQrUkVdDKjuhix1RwnVG7',
      details: {
        address: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
        name: 'asdasdsa',
        profilePicture: '',
        state: 'online',
        status: 'dasdad',
        textilePubkey:
          'bbaareifiszb2kb2mejsgng4d52g2y2fxxuhhgnblixjqsvdatptpn7t6dy',
      },
      pin: '?{fDn4s8I5~sb@*F858{]CZ@A',
    }

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    const result = async () => {
      await accounts.default.unlock({ commit, state }, state.pin)
    }

    expect(result).rejects.toThrowError(AccountsError.PIN_TOO_SHORT)
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
