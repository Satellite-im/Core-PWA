import * as actions from './actions'
import { SettingsError } from './types'

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

  test.skip('actions.default.clearLocalStorage successful', async () => {
    db.delete = jest.fn().mockReturnValue(true)
    Dexie.exists = jest.fn().mockReturnValue(true)
    await actions.default.clearLocalStorage()
  })

  test.skip('actions.default.clearLocalStorage error', async () => {
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

  test.skip('actions.default.clearLocalStorage successful but dexies does not exist', async () => {
    db.delete = jest.fn().mockReturnValue(true)
    Dexie.exists = jest.fn().mockReturnValue(undefined)
    await actions.default.clearLocalStorage()
  })
})
