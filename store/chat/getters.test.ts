import getters from '~/store/chat/getters'
import InitialChatState from '~/store/chat/state'

const state = { ...InitialChatState() }

const address = 'testaddress'
const testFile = new File(['hello'], 'test_fil.txt', {
  type: 'text/plain',
})

describe('misc', () => {
  test('getFiles', () => {
    const rootGetters = {
      'conversation/recipient': {
        address,
      },
    }
    const testValue = [
      {
        file: testFile,
        nsfw: false,
        progress: 0,
      },
    ]
    state.files[address] = testValue

    const result = getters.getFiles(state, state, state, rootGetters)
    expect(result).toBe(state.files[address])
  })

  test('getFiles but not found', () => {
    const rootGetters = {
      'conversation/recipient': {
        address: undefined,
      },
    }
    const result = getters.getFiles(state, state, state, rootGetters)
    expect(result).toEqual([])
  })
})
