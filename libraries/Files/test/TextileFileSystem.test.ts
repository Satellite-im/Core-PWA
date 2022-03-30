import fs from 'fs'
import path from 'path'
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
  // test('TextileFileSystem.uploadFile', async () => {
  //   const TMConstructor = Vue.prototype.$TextileManager
  //   TMConstructor.bucket = jest.fn()
  //   TMConstructor.bucket.pushFile = jest.fn()
  //   TMConstructor.bucket.pushFile.mockReturnValueOnce({
  //     path: {
  //       path: '0x0aef',
  //     },
  //   })
  //   const file = new File(['hello'], 'test_fil.txt', {
  //     type: 'text/plain',
  //   })
  //   await inst.uploadFile(file)
  //   expect(TMConstructor.bucket.pushFile).toHaveBeenCalled()
  // })
  test('TextileFileSystem.removeFile', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.bucket = jest.fn()
    TMConstructor.bucket.removeFile = jest.fn()
    await inst.removeFile('TestFile.png')
    expect(TMConstructor.bucket.removeFile).toHaveBeenCalled()
  })
  // test('TextileFileSystem.uploadFile svg', async () => {
  //   const TMConstructor = Vue.prototype.$TextileManager
  //   TMConstructor.bucket = jest.fn()
  //   TMConstructor.bucket.pushFile = jest.fn()
  //   TMConstructor.bucket.pushFile.mockReturnValueOnce({
  //     path: {
  //       path: '0x0aef',
  //     },
  //   })
  //   const buffer = await fs.promises.readFile(
  //     path.join('utilities/assets/svg-image.svg'),
  //   )
  //   const file = new File([buffer], 'svg-image.svg', { type: 'image/svg' })
  //   await inst.uploadFile(file)
  //   expect(TMConstructor.bucket.pushFile).toHaveBeenCalled()
  // })
})
