import Vue from 'vue'
import { TextileError } from './types'
import * as actions from '~/store/textile/actions'
import * as Logger from '~/utilities/Logger'
import TextileManager from '~/libraries/Textile/TextileManager'
import { TextileFileSystem } from '~/libraries/Files/TextileFileSystem'
import { Config } from '~/config'

Vue.prototype.$Config = Config

const DefaultLogger = Logger.default
Vue.prototype.$Logger = new DefaultLogger(Vue.prototype.$Config.debug)
Vue.prototype.$TextileManager = new TextileManager()
Vue.prototype.$FileSystem = new TextileFileSystem()

describe('actions.default.initialize', () => {
  test('', async () => {
    try {
      const commit = jest.fn()
      const JestTextileManager = Vue.prototype.$TextileManager
      JestTextileManager.init = jest.fn()
      JestTextileManager.getIdentityPublicKey = jest.fn()
      JestTextileManager.getIdentityPublicKey.mockReturnValueOnce('public key')
      JestTextileManager.bucket = jest.fn()
      JestTextileManager.bucket.index = jest.fn()
      JestTextileManager.bucket.index.mockReturnValueOnce('index')
      const JestFS = Vue.prototype.$FileSystem
      JestFS.import = jest.fn()
      await actions.default.initialize({ commit }, { id: 'id', pass: 'pass' })
      expect(JestTextileManager.init).toHaveBeenCalled()
      expect(JestTextileManager.init).toHaveBeenCalledWith({
        id: 'id',
        pass: 'pass',
      })
      expect(JestTextileManager.getIdentityPublicKey).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('textileInitialized', true)
      expect(commit).toHaveBeenCalledWith(
        'accounts/updateTextilePubkey',
        'public key',
        { root: true },
      )
      expect(JestFS.import).toHaveBeenCalled()
    } catch (error) {
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
