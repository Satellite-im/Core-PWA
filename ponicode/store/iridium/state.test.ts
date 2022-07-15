import * as state from '~/store/iridium/state'
// @ponicode
describe('state.default', () => {
  test('0', () => {
    const result: any = state.default()
    expect(result).toMatchSnapshot()
  })
})
