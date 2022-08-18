import fs from 'fs'
import { expect } from '@jest/globals'
import * as Thumbnail from './Thumbnail'

const ThumbnailDefault = Thumbnail.default

describe('', () => {
  test('txt thumbnail', async () => {
    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    const result = await ThumbnailDefault(testFile, 111)
    expect(result).toMatchSnapshot()
  })
  test.skip('png thumbnail', async () => {
    const buffer = fs.readFileSync('utilities/test_assets/non-heic-image.png', {
      flag: 'r',
    })
    const testBlobFile = new Blob([buffer], {
      type: 'image/png',
    })
    const testFile = new File([testBlobFile], 'test_fil.png', {
      type: 'image/png',
    })
    const result = await ThumbnailDefault(testFile, 111)
    expect(result).toMatchSnapshot()
  })
})
