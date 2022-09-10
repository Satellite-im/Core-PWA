import { Howler } from 'howler'
import actions from './actions'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

const InitialParams = {
  newMessage: true,
  hangup: true,
  call: true,
  mute: true,
  unmute: true,
  deafen: true,
  undeafen: true,
  upload: true,
  connected: true,
}

describe('Test sounds/actions', () => {
  let instance: any

  beforeEach(() => {
    instance = actions
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

    const result: any = instance.playSound(
      {
        state: { ...InitialParams },
      },
      Sounds.CALL,
    )
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

    const result: any = instance.playSound(
      {
        state: {
          ...InitialParams,
          call: false,
        },
      },
      Sounds.CALL,
    )

    const localSpy = jest.spyOn(window.HTMLMediaElement.prototype, 'play')
    expect(localSpy).not.toHaveBeenCalled()
  })

  test('sound stops', () => {
    const result: any = instance.stopSounds(
      {
        state: { ...InitialParams },
      },
      [Sounds.CALL],
    )
  })

  test('sound stops but argument is empty array', () => {
    const result: any = instance.stopSounds(
      {
        state: { ...InitialParams },
      },
      [],
    )

    expect(result).toBeUndefined()
  })

  test('sound does not stop', () => {
    const result: any = instance.stopSounds(
      {
        state: {
          ...InitialParams,
          call: false,
        },
      },
      [Sounds.CALL],
    )

    const localSpy = jest.spyOn(window.HTMLMediaElement.prototype, 'play')
    expect(localSpy).not.toHaveBeenCalled()
  })

  test('setMuteSounds', () => {
    const spy = jest.spyOn(Howler, 'mute')
    instance.setMuteSounds(
      {
        state: {
          ...InitialParams,
          mute: false,
        },
      },
      false,
    )

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenLastCalledWith(false)
  })

  test('playingSounds', () => {
    const result = instance.playingSounds(
      {
        state: {
          ...InitialParams,
          mute: false,
        },
      },
      false,
    )

    expect(result).toEqual([])
  })
})
