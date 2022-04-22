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

describe.skip('actions.default.setConsentScan', () => {
  test('0', async () => {
    const param2: any = [
      ['C:\\\\path\\to\\folder\\', 'C:\\\\path\\to\\folder\\', '.', '.'],
      [
        '/path/to/file',
        'C:\\\\path\\to\\folder\\',
        './path/to/file',
        'path/to/file.ext',
      ],
      [
        'path/to/file.ext',
        'path/to/file.ext',
        './path/to/file',
        'path/to/folder/',
      ],
      ['.', './path/to/file', './path/to/file', 'C:\\\\path\\to\\file.ext'],
    ]
    await actions.default.setConsentScan(
      'commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n',
      param2,
    )
  })

  test('1', async () => {
    const param2: any = [
      ['path/to/file.ext', '.', './path/to/file', 'C:\\\\path\\to\\folder\\'],
      [
        '/path/to/file',
        './path/to/file',
        'C:\\\\path\\to\\file.ext',
        '/path/to/file',
      ],
      ['.', 'C:\\\\path\\to\\folder\\', '.', 'C:\\\\path\\to\\folder\\'],
      [
        '.',
        'path/to/folder/',
        'C:\\\\path\\to\\folder\\',
        'C:\\\\path\\to\\folder\\',
      ],
    ]
    await actions.default.setConsentScan(
      'commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n',
      param2,
    )
  })

  test('2', async () => {
    const param2: any = [
      ['.', '.', 'path/to/file.ext', './path/to/file'],
      [
        'C:\\\\path\\to\\file.ext',
        '/path/to/file',
        'C:\\\\path\\to\\file.ext',
        'C:\\\\path\\to\\file.ext',
      ],
      [
        '/path/to/file',
        'C:\\\\path\\to\\file.ext',
        './path/to/file',
        'C:\\\\path\\to\\folder\\',
      ],
      ['/path/to/file', '.', 'path/to/file.ext', 'C:\\\\path\\to\\folder\\'],
    ]
    await actions.default.setConsentScan(
      'commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n',
      param2,
    )
  })

  test('3', async () => {
    const param2: any = [
      [
        'C:\\\\path\\to\\folder\\',
        'C:\\\\path\\to\\file.ext',
        './path/to/file',
        './path/to/file',
      ],
      ['./path/to/file', '.', '/path/to/file', '/path/to/file'],
      ['./path/to/file', '.', '.', '.'],
      ['.', '.', '/path/to/file', 'C:\\\\path\\to\\folder\\'],
    ]
    await actions.default.setConsentScan(
      'commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n',
      param2,
    )
  })

  test('4', async () => {
    const param2: any = [
      [
        'path/to/file.ext',
        'C:\\\\path\\to\\folder\\',
        'C:\\\\path\\to\\folder\\',
        '/path/to/file',
      ],
      [
        'path/to/folder/',
        'path/to/file.ext',
        'C:\\\\path\\to\\folder\\',
        '/path/to/file',
      ],
      ['path/to/folder/', 'path/to/folder/', '/path/to/file', '/path/to/file'],
      [
        './path/to/file',
        'path/to/file.ext',
        'path/to/file.ext',
        './path/to/file',
      ],
    ]
    await actions.default.setConsentScan(
      'commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n',
      param2,
    )
  })

  test('5', async () => {
    await actions.default.setConsentScan('', [])
  })
})
