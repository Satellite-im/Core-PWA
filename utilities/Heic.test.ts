import fs from 'fs'
import { isHeic } from '~/utilities/Heic'

describe('init', () => {
  test('heic function exists', () => {
    expect(isHeic).toMatchSnapshot()
  })

  test('heic function check heic image', () => {
    const buffer = fs.readFileSync('utilities/assets/heic-image.heic', {
      flag: 'r',
    })
    const result: any = isHeic(buffer)

    expect(result).toBeTruthy()
    expect(result).toMatchSnapshot()
  })

  test('heic function check non heic image', () => {
    const buffer = fs.readFileSync('utilities/assets/non-heic-image.png', {
      flag: 'r',
    })
    const result: any = isHeic(buffer)

    expect(result).toBeFalsy()
    expect(result).toMatchSnapshot()
  })

  test('heic function check a non buffer response', () => {
    const buffer = Buffer.from('Hello, World', 'utf8') // buffer.length is 12
    const result: any = isHeic(buffer)

    expect(result).toBeFalsy()
    expect(result).toMatchSnapshot()
  })
})
