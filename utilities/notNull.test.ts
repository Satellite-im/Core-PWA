import * as notNull from '~/utilities/notNull'

describe('notNull.default', () => {
  test('0', () => {
    const result: any = notNull.default(undefined)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = notNull.default(null)
    expect(result).toMatchSnapshot()
  })
})
