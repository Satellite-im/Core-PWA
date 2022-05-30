import { Dexie } from 'dexie'
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
    Dexie.exists = jest.fn().mockReturnValue(true)
    await actions.default.clearLocalStorage()
  })

  test('actions.default.clearLocalStorage error', async () => {
    Vue.prototype.$TextileManager = new TextileManager()
    try {
      db.delete = jest.fn().mockImplementation(() => {
        throw new Error('mock error')
      })
      await actions.default.clearLocalStorage()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        SettingsError.DATABASE_NOT_CLEARED,
      )
    }
  })
})
