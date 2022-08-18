import { expect } from '@jest/globals'
import * as IoTS from '~/utilities/io-ts'

describe('IoTS.fromEnum', () => {
  test('0', () => {
    const result: any = IoTS.fromEnum('Anas', false)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = IoTS.fromEnum('George', false)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = IoTS.fromEnum('Anas', true)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = IoTS.fromEnum('Michael', true)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = IoTS.fromEnum('Edmond', false)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = IoTS.fromEnum('', true)
    expect(result).toMatchSnapshot()
  })
})
