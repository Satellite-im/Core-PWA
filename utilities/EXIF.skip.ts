// @ts-ignore
import rewire from 'rewire'
import { expect } from '@jest/globals'
const EXIF = rewire('~/utilities/EXIF')
const strip = EXIF.__get__('strip')

describe.skip('EXIF.stripEXIF', () => {
  // AP-331
  test('0', () => {
    const result: any = EXIF.stripEXIF({ type: 'image/jpeg' })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = EXIF.stripEXIF({ type: 'array' })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = EXIF.stripEXIF({ type: 'string' })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = EXIF.stripEXIF({ type: 'object' })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = EXIF.stripEXIF({ type: 'number' })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = EXIF.stripEXIF({ type: '' })
    expect(result).toMatchSnapshot()
  })
})

describe('strip', () => {
  test('0', () => {
    const object: any = [
      [256, 32, 32, 0],
      [32, 0, 64, 16],
      [16, 32, 16, 256],
      [10, 0, 10, 0],
    ]
    const result: any = strip({ target: { result: { slice: () => object } } })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      [16, 0, 10, 0],
      [256, 64, 256, 256],
      [32, 16, 32, 16],
      [32, 64, 32, 256],
    ]
    const result: any = strip({ target: { result: { slice: () => object } } })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [
      [32, 256, 256, 16],
      [0, 64, 256, 16],
      [32, 256, 256, 64],
      [32, 10, 256, 256],
    ]
    const result: any = strip({ target: { result: { slice: () => object } } })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      [64, 16, 256, 256],
      [10, 64, 64, 10],
      [256, 256, 64, 0],
      [256, 64, 0, 256],
    ]
    const result: any = strip({ target: { result: { slice: () => object } } })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      [0, 64, 32, 10],
      [10, 16, 32, 0],
      [10, 64, 16, 0],
      [64, 64, 0, 10],
    ]
    const result: any = strip({ target: { result: { slice: () => object } } })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = strip({ target: { result: { slice: () => [] } } })
    expect(result).toMatchSnapshot()
  })
})
