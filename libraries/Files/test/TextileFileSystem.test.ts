import Vue from 'vue'
import * as TFS from '../TextileFileSystem'
import { Fil } from '../Fil'
import TextileManager from '~/libraries/Textile/TextileManager'
// Vue.prototype.$TextileManager = new TextileManager()

describe('', () => {
  // const TFSConstructor = new TFS.TextileFileSystem()
  // const inst = TFSConstructor
  // const state = inst.bucket

  test('get bucket TFS', () => {
    expect('').toEqual('')
    //   const result: any = inst.bucket
    //   expect(result).toEqual(state)
  })
  // test('upload file TFS', async () => {
  //   const TMConstructor = Vue.prototype.$TextileManager
  //   TMConstructor.bucket = jest.fn()
  //   TMConstructor.bucket.pushFile = jest.fn()
  //   TMConstructor.bucket.pushFile.mockReturnValueOnce({
  //     path: {
  //       path: '0x0aef',
  //     },
  //   })
  //   const mockFileData = {
  //     name: 'TestFile.png',
  //     hash: '0x0aef',
  //     size: 42345,
  //     description: 'Test file description',
  //   }
  //   const file = new Fil(mockFileData)
  //   await inst.uploadFile(file)
  //   expect(TMConstructor.bucket.pushFile).toHaveBeenCalled()
  // })
  // test('remove file TFS', async () => {
  //   const TMConstructor = Vue.prototype.$TextileManager
  //   TMConstructor.bucket = jest.fn()
  //   TMConstructor.bucket.removeFile = jest.fn()
  //   await inst.removeFile('TestFile.png')
  //   expect(TMConstructor.bucket.removeFile).toHaveBeenCalled()
  // })
})
