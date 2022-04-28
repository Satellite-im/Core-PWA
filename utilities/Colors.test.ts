import * as Colors from '~/utilities/Colors'

describe('Colors.hexToRGB', () => {
  test('0', () => {
    const result: any = Colors.hexToRGB('0x3##0xA')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Colors.hexToRGB('0xA#')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Colors.hexToRGB('#0x3')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = Colors.hexToRGB('##')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = Colors.hexToRGB('0x3#0xA')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = Colors.hexToRGB('')
    expect(result).toMatchSnapshot()
  })
})
