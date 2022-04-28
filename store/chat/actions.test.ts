import * as actions from '~/store/chat/actions'

describe('actions.default.setChatText', () => {
  test('0', async () => {
    const commit = jest.fn()
    const request = {
      userId: 'quidem animi delectus',
      value:
        'In aut ducimus eius ut. Commodi id numquam et tempora officiis aut neque qui necessitatibus. Asperiores ea temporibus et eum facere illum consequatur.',
    }

    await actions.default.setChatText({ commit }, request)
    expect(commit).toBeCalledWith('chatText', request)
  })
})
