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

describe('Circle.stringToColor generated', () => {
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

describe('Circle.stringToColor', () => {
  it('should convert first did to color', () => {
    const argument: string =
      'did:key:z6MkiM2pazmVDL8BgUoRP1V3KU6tufrhMJbXQAEUD76ZVyZp '
    const result: string = Circle.stringToColor(argument)

    expect(result).toBe('#3867d6')
  })

  it('should convert second did to color', () => {
    const argument: string =
      'did:key:z6MkgJXKqJSredVSd6W21oXyjFjVaD5kBLfewRT4Gm6L5Nww'
    const result: string = Circle.stringToColor(argument)

    expect(result).toBe('#2bcbba')
  })
})
