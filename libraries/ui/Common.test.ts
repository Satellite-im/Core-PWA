import * as Common from '~/libraries/ui/Common'

describe('Common.validURL', () => {
  test('0', () => {
    const result: any = Common.validURL('foo bar')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Common.validURL('This is a Text')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Common.validURL('Foo bar')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = Common.validURL('Hello, world!')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = Common.validURL('')
    expect(result).toMatchSnapshot()
  })
})
