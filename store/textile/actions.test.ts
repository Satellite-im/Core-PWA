import Vue from 'vue'
import { TextileError } from './types'
import { Config } from '~/config'
import { Fil } from '~/libraries/Files/Fil'
import { FilSystem } from '~/libraries/Files/FilSystem'
import { TextileFileSystem } from '~/libraries/Files/TextileFileSystem'
import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'
import TextileManager from '~/libraries/Textile/TextileManager'
import * as actions from '~/store/textile/actions'
import * as Logger from '~/utilities/Logger'

Vue.prototype.$Config = Config

const DefaultLogger = Logger.default
Vue.prototype.$Logger = new DefaultLogger(Vue.prototype.$Config.debug)
Vue.prototype.$TextileManager = new TextileManager()
Vue.prototype.$FileSystem = new TextileFileSystem()

describe('actions.default.initialize', () => {
  test('initialize', async () => {
    try {
      // Mocks so we have a fs.export
      const mockFileData = {
        name: 'TestFile.png',
        hash: '0x0aef',
        size: 42345,
        descrption: 'Test file description',
      }

      const mockDirectoryData = {
        name: 'dir',
        liked: false,
        shared: false,
        type: DIRECTORY_TYPE.DEFAULT,
      }

      const file = new Fil(mockFileData)
      const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })
      const fs = new FilSystem()

      fs.addChild(file)
      fs.createDirectory(mockDirectoryData)
      fs.openDirectory('dir')
      fs.addChild(file2)

      // Mocks for the arguments
      const commit = jest.fn()
      const JestTextileManager = Vue.prototype.$TextileManager
      JestTextileManager.init = jest.fn()
      JestTextileManager.getIdentityPublicKey = jest.fn()
      JestTextileManager.getIdentityPublicKey.mockReturnValueOnce('public key')
      JestTextileManager.bucket = jest.fn()
      JestTextileManager.bucket.index = fs.export

      await actions.default.initialize({ commit }, { id: 'id', pass: 'pass' })

      expect(JestTextileManager.init).toHaveBeenCalled()
      expect(JestTextileManager.init).toHaveBeenCalledWith({
        id: 'id',
        pass: 'pass',
      })
      expect(JestTextileManager.getIdentityPublicKey).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith(
        'accounts/updateTextilePubkey',
        'public key',
        { root: true },
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  })
  test('initialize without record.consent_scan', async () => {
    try {
      // Mocks so we have a fs.export
      const mockFileData = {
        name: 'TestFile1.png',
        hash: '0x0aef',
        size: 42345,
        descrption: 'Test file description',
      }

      const mockDirectoryData = {
        name: 'dir1',
        liked: false,
        shared: false,
        type: DIRECTORY_TYPE.DEFAULT,
      }

      const file = new Fil(mockFileData)
      const file2 = new Fil({ ...mockFileData, name: 'testPng3.png' })
      const fs = new FilSystem()

      fs.addChild(file)
      fs.createDirectory(mockDirectoryData)
      fs.openDirectory('dir')
      fs.addChild(file2)

      // Mocks for the arguments
      const commit = jest.fn()
      const JestTextileManager = Vue.prototype.$TextileManager
      JestTextileManager.init = jest.fn()
      JestTextileManager.getIdentityPublicKey = jest.fn()
      JestTextileManager.getIdentityPublicKey.mockReturnValueOnce('public key')
      JestTextileManager.bucket = jest.fn()
      JestTextileManager.bucket.index = fs.export
      JestTextileManager.userInfoManager = jest.fn()
      JestTextileManager.userInfoManager.getUserRecord = jest
        .fn()
        .mockReturnValueOnce({
          consent_scan: true,
        })

      await actions.default.initialize({ commit }, { id: 'id', pass: 'pass' })

      expect(JestTextileManager.init).toHaveBeenCalled()
      expect(JestTextileManager.init).toHaveBeenCalledWith({
        id: 'id',
        pass: 'pass',
      })
      expect(JestTextileManager.getIdentityPublicKey).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith(
        'accounts/updateTextilePubkey',
        'public key',
        { root: true },
      )
      expect(commit).toHaveBeenCalledWith('settings/setConsentScan', true, {
        root: true,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  })
  test('initialize without record.block_nsfw', async () => {
    try {
      // Mocks so we have a fs.export
      const mockFileData = {
        name: 'TestFile2.png',
        hash: '0x0aef',
        size: 42345,
        descrption: 'Test file description',
      }

      const mockDirectoryData = {
        name: 'dir2',
        liked: false,
        shared: false,
        type: DIRECTORY_TYPE.DEFAULT,
      }

      const file = new Fil(mockFileData)
      const file2 = new Fil({ ...mockFileData, name: 'testPng4.png' })
      const fs = new FilSystem()

      fs.addChild(file)
      fs.createDirectory(mockDirectoryData)
      fs.openDirectory('dir')
      fs.addChild(file2)

      // Mocks for the arguments
      const commit = jest.fn()
      const JestTextileManager = Vue.prototype.$TextileManager
      JestTextileManager.init = jest.fn()
      JestTextileManager.getIdentityPublicKey = jest.fn()
      JestTextileManager.getIdentityPublicKey.mockReturnValueOnce('public key')
      JestTextileManager.bucket = jest.fn()
      JestTextileManager.bucket.index = fs.export
      JestTextileManager.userInfoManager = jest.fn()
      JestTextileManager.userInfoManager.getUserRecord = jest
        .fn()
        .mockReturnValueOnce({
          block_nsfw: true,
        })

      await actions.default.initialize({ commit }, { id: 'id', pass: 'pass' })

      expect(JestTextileManager.init).toHaveBeenCalled()
      expect(JestTextileManager.init).toHaveBeenCalledWith({
        id: 'id',
        pass: 'pass',
      })
      expect(JestTextileManager.getIdentityPublicKey).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith(
        'accounts/updateTextilePubkey',
        'public key',
        { root: true },
      )
      expect(commit).toHaveBeenCalledWith(
        'textile/updateUserThreadData',
        true,
        {
          root: true,
        },
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  })
})

describe('actions.default.clearUploadStatus', () => {
  test('', () => {
    const commit = jest.fn()
    actions.default.clearUploadStatus({ commit })
    expect(commit).toHaveBeenCalledWith('clearUploadProgress', {})
  })
})

describe('actions.default.subscribeToSentbox', () => {
  test('Mailbox Manager does not exist', async () => {
    try {
      await actions.default.subscribeToSentbox()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        TextileError.MAILBOX_MANAGER_NOT_FOUND,
      )
    }
  })
  test.skip('Mailbox Manager exists', async () => {
    // On progress
    const JestTextileManager = Vue.prototype.$TextileManager

    const JestMailboxManager = JestTextileManager.mailboxManager
    await JestTextileManager.authenticate('id', 'pass', {}).then(async () => {
      JestMailboxManager.isSubscribed = jest.fn()
      JestMailboxManager.isSubscribed.mockReturnValueOnce(true)
      await actions.default.subscribeToSentbox()
    })
  })
})
