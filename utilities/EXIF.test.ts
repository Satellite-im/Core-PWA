import * as exif from './EXIF'
import { Fil } from '~/libraries/Files/Fil'
// import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'

describe('', () => {
  test('file is not jpeg', async () => {
    const mockFileData = {
      name: 'TestFile.png',
      hash: '0x0aef',
      size: 4337487,
      description: 'Test file description',
    }

    const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })
    const result = await exif.stripEXIF(file2)
    expect(result).toBe(file2)
  })

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

  test('file returns TypeError', async () => {
    const mockFileData = {
      name: 'TestFile.png',
      hash: '0x0aef',
      size: 4337487,
      description: 'Test file description',
      type: 'image/jpeg',
    }

    const file2 = new Fil({ ...mockFileData, name: 'testPng2.png' })
    jest.spyOn(console, 'warn').mockImplementation()
    try {
      await exif.stripEXIF(file2)
    } catch (error) {
      expect(error).toThrow(TypeError)
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          `TypeError: Failed to execute 'readAsArrayBuffer' on 'FileReader': parameter 1 is not of type 'Blob'.`,
        ),
      )
    }
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
