import fs from 'fs'
import Vue from 'vue'
import TextileManager from '~/libraries/Textile/TextileManager'
import { Fil } from '../Fil'
import * as TFS from '../TextileFileSystem'
Vue.prototype.$TextileManager = new TextileManager()

describe('', () => {
  const TFSConstructor = new TFS.TextileFileSystem()
  const inst = TFSConstructor
  const state = inst.bucket

  test('get bucket TFS', () => {
    expect('').toEqual('')
    const result: any = inst.bucket
    expect(result).toEqual(state)
  })
  test('upload file TFS', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.bucket = jest.fn()
    TMConstructor.bucket.pushFile = jest.fn()
    TMConstructor.bucket.pushFile.mockReturnValueOnce({
      path: {
        path: '0x0aef',
      },
    })
    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    const file = new Fil(testFile)
    await inst.uploadFile(file)
    expect(TMConstructor.bucket.pushFile).toHaveBeenCalled()
  })
  test('remove file TFS', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.bucket = jest.fn()
    TMConstructor.bucket.removeFile = jest.fn()
    await inst.removeFile('TestFile.png')
    expect(TMConstructor.bucket.removeFile).toHaveBeenCalled()
  })
  test.skip('upload file TFS svg', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.bucket = jest.fn()
    TMConstructor.bucket.pushFile = jest.fn()
    TMConstructor.bucket.pushFile.mockReturnValueOnce({
      path: {
        path: '0x0aef',
      },
    })
    const fileBuffer = fs.readFileSync('utilities/assets/svg-image.svg', {
      flag: 'r',
    })
    const testFile = new File([fileBuffer as BlobPart], 'svg-image.svg', {
      type: 'image/svg',
    })
    const file = new Fil(testFile)
    await inst.uploadFile(file)
    expect(TMConstructor.bucket.pushFile).toHaveBeenCalled()
  })
})
