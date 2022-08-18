import { expect } from '@jest/globals'
import * as exif from './EXIF'

describe('', () => {
  test('file is jpeg', async () => {
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })

    // const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })
    const result = await exif.stripEXIF(jpegBlob)
    expect(result).toBe(jpegBlob)
  })
  test.skip('file is jpeg but promise rejects', async () => {
    const jpegBlob = new Blob([], { type: 'image/jpeg' })

    // const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })
    const result = await exif.stripEXIF(jpegBlob)
    // expect(result).rejects.toMatchObject({})
    expect(result).toBe(jpegBlob)
  })

  test('dv.getUint16 mocked ', async () => {
    // global.DataView = class MockDataView {
    //   filename: string
    //   constructor(
    //     parts: (string | Blob | ArrayBuffer | ArrayBufferView)[],
    //     filename: string,
    //     properties?: FilePropertyBag,
    //   ) {
    //     this.filename = filename
    //   }
    // }
    // global.DataView = jest.fn()
    // global.DataView.getUint16 = jest.fn().mockImplementationOnce(() => 42)
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })

    // const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })
    const result = await exif.stripEXIF(jpegBlob)
    expect(result).toBe(jpegBlob)
  })
})
