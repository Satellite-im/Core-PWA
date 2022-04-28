import Vue from 'vue'
import { TextileFileSystem } from '../TextileFileSystem'
import TextileManager from '~/libraries/Textile/TextileManager'
Vue.prototype.$TextileManager = new TextileManager()

describe('', () => {
  const TextileFileSystemConstructor = new TextileFileSystem()
  const inst = TextileFileSystemConstructor
  const state = inst.bucket

  test('TextileFileSystem.bucket', () => {
    const result: any = inst.bucket
    expect(result).toEqual(state)
  })

  test('TextileFileSystem.removeFile', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.bucket = jest.fn()
    TMConstructor.bucket.removeFile = jest.fn()
    await inst.removeFile('TestFile.png')
    expect(TMConstructor.bucket.removeFile).toHaveBeenCalled()
  })
})
