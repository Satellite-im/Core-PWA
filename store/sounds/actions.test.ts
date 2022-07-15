import { Howler } from 'howler'
import actions from './actions'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

describe('Manage sounds', () => {
  let inst: any

  beforeEach(() => {
    inst = actions
  })

  test('sound plays', () => {
    window.HTMLMediaElement.prototype.load = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.play = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.pause = () => {
      return Promise.resolve()
    }

    const result: any = inst.playSound(
      {
        state: {
          newMessage: true,
          hangup: true,
          call: true,
          mute: true,
          unmute: true,
          deafen: true,
          undeafen: true,
          upload: true,
          connected: true,
        },
      },
      Sounds.CALL,
    )

    expect(result).toMatchSnapshot()
  })

  test('sound does not play', () => {
    window.HTMLMediaElement.prototype.load = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.play = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.pause = () => {
      return Promise.resolve()
    }

    const result: any = inst.playSound(
      {
        state: {
          newMessage: true,
          hangup: true,
          call: false,
          mute: true,
          unmute: true,
          deafen: true,
          undeafen: true,
          upload: true,
          connected: true,
        },
      },
      Sounds.CALL,
    )

    expect(result).toMatchSnapshot()
  })

  test('sound stops', () => {
    const result: any = inst.stopSound(
      {
        state: {
          newMessage: true,
          hangup: true,
          call: true,
          mute: true,
          unmute: true,
          deafen: true,
          undeafen: true,
          upload: true,
          connected: true,
        },
      },
      Sounds.CALL,
    )

    expect(result).toMatchSnapshot()
  })

  test('sound does not stop', () => {
    const result: any = inst.stopSound(
      {
        state: {
          newMessage: true,
          hangup: true,
          call: false,
          mute: true,
          unmute: true,
          deafen: true,
          undeafen: true,
          upload: true,
          connected: true,
        },
      },
      Sounds.CALL,
    )

    expect(result).toMatchSnapshot()
  })

  test('setMuteSounds', () => {
    const spy = jest.spyOn(Howler, 'mute')
    inst.setMuteSounds(
      {
        state: {
          newMessage: true,
          hangup: true,
          call: true,
          mute: false,
          unmute: true,
          deafen: true,
          undeafen: true,
          upload: true,
          connected: true,
        },
      },
      false,
    )

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenLastCalledWith(false)
  })
})
