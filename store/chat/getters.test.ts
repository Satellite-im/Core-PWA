import * as module from '~/store/chat/getters'
import InitialChatState from '~/store/chat/state'

describe('misc', () => {
  test('getFiles', () => {
    const argument = 'address1'
    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    const state = { ...InitialChatState() }
    state.files = {
      address1: {
        file: testFile,
        url: 'url',
        nsfw: {
          checking: false,
          status: false,
        },
      },
    }

    const firstFunction = module.default.getFiles(state)
    const result = firstFunction(argument)

    expect(result).toBe(state.files[argument])
  })

  test('getFiles but not found', () => {
    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    const state = { ...InitialChatState() }
    state.files = {
      address1: {
        file: testFile,
        url: 'url',
        nsfw: {
          checking: false,
          status: false,
        },
      },
    }

    const firstFunction = module.default.getFiles(state)
    const result = firstFunction('address2')

    expect(result).toEqual([])
  })
})
