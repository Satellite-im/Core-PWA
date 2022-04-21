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

  test('actions.default.clearLocalStorage successful', async () => {
    const commit = jest.fn()
    await actions.default.clearLocalStorage({ commit })
    expect(window.location.reload).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('removeAppState', true)
  })

  test('actions.default.clearLocalStorage error', async () => {
    try {
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
})
