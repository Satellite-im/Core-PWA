import * as exif from './EXIF'

describe('', () => {
  test('file is jpeg', async () => {
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })
    const result = await exif.stripEXIF(jpegBlob)
    expect(result).toBe(jpegBlob)
  })
  test.skip('file is jpeg but promise rejects', async () => {
    const jpegBlob = new Blob([], { type: 'image/jpeg' })
    const result = await exif.stripEXIF(jpegBlob)
    expect(result).toBe(jpegBlob)
  })

  test('dv.getUint16 mocked ', async () => {
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })
    const result = await exif.stripEXIF(jpegBlob)
    expect(result).toBe(jpegBlob)
  })
})
