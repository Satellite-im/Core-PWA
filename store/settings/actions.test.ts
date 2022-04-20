import Vue from 'vue'
import { TextileError } from '../textile/types'
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

  test('setConsentScan with consentScan but error occured', async () => {
    const commit = jest.fn()

    try {
      await actions.default.setConsentScan({ commit }, true)
    } catch (error) {
      console.log(2)
      expect(commit).toHaveBeenCalledWith('setConsentScan', true)
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        TextileError.USERINFO_MANAGER_NOT_FOUND,
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
})
