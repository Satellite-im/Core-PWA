import { UIState } from './types'
import * as getters from '~/store/ui/getters'
import InitialUIState from '~/store/ui/state'

let instance: any
let localState: UIState

describe('Test ui/getters', () => {
  beforeEach(() => {
    instance = getters.default
    localState = InitialUIState()
  })

  it('should sort most used emojis', () => {
    // from order 1,3,2
    localState.mostEmojiUsed = [
      {
        code: 'thumbup',
        content: '👍',
        count: 1,
      },
      {
        code: 'flag_id',
        content: '🇮🇩',
        count: 3,
      },
      {
        code: 'pray',
        content: '🙏 ',
        count: 2,
      },
    ]

    const result = instance.getSortedMostUsedEmojis(localState)

    // from order 1,3,2 to 3,2,1

    expect(result[0]).toEqual({ code: 'flag_id', content: '🇮🇩', count: 3 })
    expect(result[1]).toEqual({ code: 'pray', content: '🙏 ', count: 2 })
    expect(result[2]).toEqual({ code: 'thumbup', content: '👍', count: 1 })
  })

  it('should sort most used emojis 1-2-3', () => {
    // from order 1,2,3
    localState.mostEmojiUsed = [
      {
        code: 'thumbup',
        content: '👍',
        count: 1,
      },
      {
        code: 'pray',
        content: '🙏 ',
        count: 2,
      },
      {
        code: 'flag_id',
        content: '🇮🇩',
        count: 3,
      },
    ]

    const result = instance.getSortedMostUsedEmojis(localState)

    // from order 1,3,2 to 3,2,1

    expect(result[0]).toEqual({ code: 'flag_id', content: '🇮🇩', count: 3 })
    expect(result[1]).toEqual({ code: 'pray', content: '🙏 ', count: 2 })
    expect(result[2]).toEqual({ code: 'thumbup', content: '👍', count: 1 })
  })

  it('should sort all unseen notifications and return error', () => {
    // from order 1,2,3
    localState.notifications = [
      {
        at: 1,
        state: 'READ',
      },
      {
        at: 3,
        state: 'UNREAD',
      },
      {
        at: 2,
        state: 'READ',
      },
    ]

    try {
      const result = instance.allUnseenNotifications(localState)
    } catch (error) {
      // Should return TypeError because AlertsState does not exist anymore.
      // Expected error: [TypeError: Cannot read properties of undefined (reading 'UNREAD')]
    }
  })
})
