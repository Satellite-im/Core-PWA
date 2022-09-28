import * as state from '~/store/ui/state'

describe('state.default', () => {
  test('0', () => {
    const result: any = state.default()
    expect(result).toMatchSnapshot()
  })
})
