import * as state from '~/store/conversation/state'

describe('state.default', () => {
  test('0', () => {
    const result: any = state.default()
    expect(result).toMatchSnapshot()
  })
})
