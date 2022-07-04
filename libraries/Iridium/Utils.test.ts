import * as utils from '~/libraries/Textile/utils'

describe('utils.stringToTypedBase64', () => {
  test('0', () => {
    const result: any = utils.stringToTypedBase64('something.example.com')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = utils.stringToTypedBase64('google.com')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = utils.stringToTypedBase64('email@Google.com')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = utils.stringToTypedBase64('user@host:300')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = utils.stringToTypedBase64('TestUpperCase@Example.com')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = utils.stringToTypedBase64('')
    expect(result).toMatchSnapshot()
  })
})
