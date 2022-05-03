import 'url-polyfill'
import 'jsdom-worker'
import Vue from 'vue'
import { TextileFileSystem } from '../TextileFileSystem'
import TextileManager from '~/libraries/Textile/TextileManager'

Vue.prototype.$TextileManager = new TextileManager()

describe('', () => {
  const TMConstructor = Vue.prototype.$TextileManager
  TMConstructor.bucket = jest.fn()
  TMConstructor.bucket.removeFile = jest.fn()
  TMConstructor.bucket.pushFile = jest.fn()
  const TextileFileSystemConstructor = new TextileFileSystem()
  const inst = TextileFileSystemConstructor
  const state = inst.bucket

  test('TextileFileSystem.bucket', () => {
    const result: any = inst.bucket
    expect(result).toEqual(state)
  })

  test('TextileFileSystem.removeFile', async () => {
    await inst.removeFile('TestFile.png')
    expect(TMConstructor.bucket.removeFile).toHaveBeenCalled()
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
    expect(TMConstructor.bucket.pushFile).toHaveBeenCalled()
  })
})
