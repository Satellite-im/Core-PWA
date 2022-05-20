import Vue from 'vue'
import * as actions from './actions'
import { SettingsError } from './types'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import TextileManager from '~/libraries/Textile/TextileManager'

describe('actions.default', () => {
  const original = window.location

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    })
  })

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    })
  })

  test('actions.default.clearLocalStorage successful', async () => {
    Vue.prototype.$TextileManager = new TextileManager()
    db.delete = jest.fn().mockReturnValue(true)
    const commit = jest.fn()
    await actions.default.clearLocalStorage({ commit })
    expect(window.location.reload).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('removeAppState', true)
  })

  test('actions.default.clearLocalStorage error', async () => {
    Vue.prototype.$TextileManager = new TextileManager()
    try {
      db.delete = jest.fn().mockImplementation(() => {
        throw new Error('mock error')
      })
      const commit = jest.fn()
      await actions.default.clearLocalStorage({ commit })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        SettingsError.DATABASE_NOT_CLEARED,
      )
    }
  })

  test('setConsentScan with consentScan', async () => {
    Vue.prototype.$TextileManager = new TextileManager()
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.userInfoManager = jest.fn()
    TMConstructor.userInfoManager.setConsent = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve())

    const commit = jest.fn()

    await actions.default.setConsentScan({ commit }, true)
    expect(commit).toHaveBeenCalledWith('setConsentScan', true)
    expect(TMConstructor.userInfoManager.setConsent).toHaveBeenCalled()
  })

  test('setConsentScan with consentScan but error occured', async () => {
    Vue.prototype.$TextileManager = new TextileManager()
    const commit = jest.fn()

    jest.spyOn(console, 'log').mockImplementation()
    await actions.default.setConsentScan({ commit }, true)
    expect(console.log).toHaveBeenCalled()
  })

  test('setBlockNsfw with blockNsfw', async () => {
    Vue.prototype.$TextileManager = new TextileManager()
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.userInfoManager = jest.fn()
    TMConstructor.userInfoManager.setBlockNsfw = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve())

    const commit = jest.fn()

    await actions.default.setBlockNsfw({ commit }, true)
    expect(TMConstructor.userInfoManager.setBlockNsfw).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('setBlockNsfw', true)
  })

  test('setBlockNsfw with blockNsfw but error occured', async () => {
    Vue.prototype.$TextileManager = new TextileManager()
    const commit = jest.fn()

    jest.spyOn(console, 'log').mockImplementation()
    await actions.default.setBlockNsfw({ commit }, true)
    expect(console.log).toHaveBeenCalled()
  })
})
