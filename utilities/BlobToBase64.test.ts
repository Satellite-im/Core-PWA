import * as module from './BlobToBase64'

describe('convert blob to base 64 successfully', () => {
  test('file is jpeg', async () => {
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })

    const result = await module.default(jpegBlob)
    expect(result).toBe('data:image/jpeg;base64,dGVzdGluZw==')
  })

  test('file is text', async () => {
    const textBlob = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })

    const result = await module.default(textBlob)
    expect(result).toBe('data:text/plain;base64,aGVsbG8=')
  })
})

describe('convert blob to base 64 failing', () => {
  test('file is jpeg', async () => {
    Object.defineProperty(global, 'FileReader', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        readAsDataURL: jest.fn().mockImplementationOnce(() => {
          throw new Error('mock error')
        }),
        onload: jest.fn(),
      })),
    })
    const jpegBlob = new Blob(['testing'], { type: 'image/jpeg' })

    try {
      await module.default(jpegBlob)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'mock error')
    }
  })
})
