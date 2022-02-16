import Vue from 'vue'
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import * as accounts from '~/store/accounts/actions'
import TextileManager from '~/libraries/Textile/TextileManager'
import { Config } from '~/config'

Vue.prototype.$Config = Config

// const DefaultTextileManager = TextileManager
Vue.prototype.$TextileManager = new TextileManager()

enableFetchMocks()

describe('init', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
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
