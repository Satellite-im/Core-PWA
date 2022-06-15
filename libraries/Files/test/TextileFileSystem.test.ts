import 'url-polyfill'
import 'jsdom-worker'
import fs from 'fs'
import Vue from 'vue'
import { TextileFileSystem } from '../TextileFileSystem'
import TextileManager from '~/libraries/Textile/TextileManager'

Vue.prototype.$TextileManager = new TextileManager()

describe('', () => {
  Vue.prototype.$TextileManager = new TextileManager()
  const TMConstructor = Vue.prototype.$TextileManager
  TMConstructor.personalBucket = jest.fn()
  TMConstructor.personalBucket.removeFile = jest.fn()
  TMConstructor.personalBucket.pushFile = jest.fn()
  const TextileFileSystemConstructor = new TextileFileSystem()
  const inst = TextileFileSystemConstructor
  const state = inst.bucket

  test('TextileFileSystem.bucket', () => {
    const result: any = inst.bucket
    expect(result).toEqual(state)
  })

  test('TextileFileSystem.removeFile', async () => {
    await inst.removeFile('TestFile.png')
    expect(TMConstructor.personalBucket.removeFile).toHaveBeenCalled()
  })

  test('TextileFileSystem.uploadFile', async () => {
    // Note that when reading this part, it might be confusing.
    // TextileFileSystem function name is: uploadFile, bucket function name is: pushFile
    // Differing with our previous unit test, where the TextileFileSystem and the bucket function name are: removeFile

    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    const nsfw = false
    const cbFunction = (callback: any, ...params: any[]) => {
      callback(params)
    }

    await inst.uploadFile(testFile, nsfw, cbFunction)
    expect(TMConstructor.personalBucket.pushFile).toHaveBeenCalled()
  })

  // This test is skipped due to it exceeding the timeout (5000 ms).
  // See https://github.com/Satellite-im/Core-PWA/pull/3044 for more info.
  test.skip('TextileFileSystem.uploadFile for heic file', async () => {
    const buffer = fs.readFileSync('utilities/test_assets/heic-image.heic', {
      flag: 'r',
    })
    const testBlobFile = new Blob([buffer], {
      type: 'image/heic',
    })
    const nsfw = false
    const cbFunction = (callback: any, ...params: any[]) => {
      callback(params)
    }

    await inst.uploadFile(testBlobFile, nsfw, cbFunction)
    expect(TMConstructor.personalBucket.pushFile).toHaveBeenCalled()
  })

  test.skip('TextileFileSystem.uploadFile for png file', async () => {
    const buffer = fs.readFileSync('utilities/test_assets/non-heic-image.png', {
      flag: 'r',
    })
    const testBlobFile = new Blob([buffer], {
      type: 'image/png',
    })
    const nsfw = false
    const cbFunction = (callback: any, ...params: any[]) => {
      callback(params)
    }

    await inst.uploadFile(testBlobFile, nsfw, cbFunction)
    expect(TMConstructor.personalBucket.pushFile).toHaveBeenCalled()
  })
})
