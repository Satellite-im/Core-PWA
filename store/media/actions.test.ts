import * as actions from '~/store/media/actions'

describe('actions.default.handler', () => {
  test('0', () => {
    const result: any = actions.default.handler()
    expect(result).toMatchSnapshot()
  })
})
describe('actions.default.acceptCall', () => {
  test('0', async () => {
    const commit = jest.fn()

    await actions.default.acceptCall({ commit })

    expect(commit).toHaveBeenCalledWith('toggleMediaIncomingCall', '')
  })
})
describe('actions.default.denyCall', () => {
  test('0', async () => {
    const commit = jest.fn()

    await actions.default.denyCall({ commit })

    expect(commit).toHaveBeenCalledWith('toggleMediaIncomingCall', '')
  })
})
