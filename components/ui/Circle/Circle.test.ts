import * as Circle from '~/utilities/Circle'

describe('Circle.addressToNumber', () => {
  test('0', () => {
    const result: any = Circle.addressToNumber('0.0.0.0')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Circle.addressToNumber('192.168.1.5')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Circle.addressToNumber('')
    expect(result).toMatchSnapshot()
  })
})

describe('Circle.toHex', () => {
  test('0', () => {
    const result: any = Circle.toHex('<?xml version="1.0" ?>\n<a b="c"/>\n')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Circle.toHex('<?xml version="1.0" ?><a b="c"/>')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Circle.toHex('')
    expect(result).toMatchSnapshot()
  })
})
