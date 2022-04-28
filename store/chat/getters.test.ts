import { ChatState } from './types'
import * as module from '~/store/chat/getters'

describe('misc', () => {
  const InitialChatState = (): ChatState => ({
    replies: [],
    chatTexts: [],
    files: {},
    countError: false,
    alertNsfw: false,
    containsNsfw: false,
  })

  test('getFiles', () => {
    const argument = 'address1'
    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    const localState = { ...InitialChatState }
    localState.files = {
      address1: {
        file: testFile,
        url: 'url',
        nsfw: {
          checking: false,
          status: false,
        },
      },
    }

    const firstFunction = module.default.getFiles(localState)
    const result = firstFunction(argument)

    expect(result).toBe(localState.files[argument])
  })

  test('getFiles but not found', () => {
    const argument = 'address1'
    const testFile = new File(['hello'], 'test_fil.txt', {
      type: 'text/plain',
    })
    const localState = { ...InitialChatState }
    localState.files = {
      address1: {
        file: testFile,
        url: 'url',
        nsfw: {
          checking: false,
          status: false,
        },
      },
    }

    const firstFunction = module.default.getFiles(localState)
    const result = firstFunction('address2')

    expect(result).toEqual([])
  })
})
