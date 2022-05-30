import { Sounds } from '~/libraries/SoundManager/SoundManager'
import * as actions from '~/store/audio/actions'

describe('actions.default.toggleMute', () => {
  test('0', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state = {
      deafened: false,
    }

    await actions.default.toggleDeafen({ commit, dispatch, state })
    expect(dispatch).toBeCalledWith('sounds/playSound', Sounds.DEAFEN, {
      root: true,
    })
  })
  test('1', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state = {
      deafened: true,
    }

    await actions.default.toggleDeafen({ commit, dispatch, state })
    expect(dispatch).toBeCalledWith('sounds/playSound', Sounds.UNDEAFEN, {
      root: true,
    })
  })
})
