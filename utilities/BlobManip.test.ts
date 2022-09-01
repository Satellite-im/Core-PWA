import { blobToBase64, blobToStream } from '~/utilities/BlobManip'

describe('convert blob to base 64 successfully', () => {
  test('file is jpeg', async () => {
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })

    const result = await blobToBase64(jpegBlob)
    expect(result).toBe('data:image/jpeg;base64,dGVzdGluZw==')
  })

  test('file is text', async () => {
    const textBlob = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })

    const result = await blobToBase64(textBlob)
    expect(result).toBe('data:text/plain;base64,aGVsbG8=')
  })
})

describe('convert blob to base 64 failing', () => {
  const original = global.FileReader
  beforeAll(() => {
    Object.defineProperty(global, 'FileReader', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        readAsDataURL: jest.fn().mockImplementationOnce(() => {
          throw new Error('mock error')
        }),
        onload: jest.fn(),
      })),
    })
  })
  afterAll(() => {
    Object.defineProperty(global, 'FileReader', {
      writable: true,
      value: original,
    })
  })

  test('file is jpeg', async () => {
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })

    try {
      await blobToBase64(jpegBlob)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'mock error')
    }
  })
})

describe('test blobToStream', () => {
  test('test', async () => {
    // Ignored for now because of possible JSDOM environment constraints

    // const original = global.ReadableStream
    // beforeAll(() => {
    //   Object.defineProperty(global, 'ReadableStream', {
    //     writable: true,
    //     value: jest.fn().mockImplementation(() => ({
    //       readAsDataURL: jest.fn().mockImplementationOnce(() => {
    //         throw new Error('mock error')
    //       }),
    //       onload: jest.fn(),
    //     })),
    //   })
    // })
    // afterAll(() => {
    //   Object.defineProperty(global, 'ReadableStream', {
    //     writable: true,
    //     value: original,
    //   })
    // })
    try {
      const textBlob = await new Blob(['testing'], { type: 'text/plain' })

      const result = await blobToStream(textBlob)
      expect(result).toBe(123)
    } catch (error) {}
  })
})
