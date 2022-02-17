import Vue from 'vue'
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import {
  AccountsError,
  AccountsState,
  RegistrationStatus,
  UserRegistrationPayload,
} from './types'
import * as accounts from '~/store/accounts/actions'
import TextileManager from '~/libraries/Textile/TextileManager'
import Crypto from '~/libraries/Crypto/Crypto'
import { Config } from '~/config'

Vue.prototype.$Config = Config

// const DefaultTextileManager = TextileManager
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
    expect(commit).toHaveBeenCalledWith('setPinHash', undefined)
    // Pin hash should be 3b4557f45660ca5364013a84dc2dce7d08ab991976a6ef81bdaa4c289997f6cb, sha256 of '12345'; but it is instead undefined.
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
