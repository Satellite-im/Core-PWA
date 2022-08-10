import { Howler } from 'howler'
import SoundManager, { Sounds } from './SoundManager'

describe('init', () => {
  it('should pass', () => {
    expect(Sounds).toMatchSnapshot(`
    Object {
    "CALL": "call",
    "CONNECTED": "connected",
    "DEAFEN": "deafen",
    "HANGUP": "hangup",
    "MUTE": "mute",
    "NEW_MESSAGE": "newMessage",
    "UNDEAFEN": "undeafen",
    "UNMUTE": "unmute",
    "UPLOAD": "upload",
    }
        `)
  })
})

describe('Manage sounds', () => {
  let inst: any
  const volume: number = 1.0

  beforeEach(() => {
    inst = new SoundManager(volume)
  })

  test('sound exists', () => {
    const result: any = inst.existsSound(Sounds.CALL)
    expect(result).toMatchSnapshot()
  })

  test("sound doesn't exists", () => {
    try {
      inst.existsSound(null)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Sound not found')
    }
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
    const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'play')
    const result: any = inst.playSound(Sounds.CALL)

    expect(spy).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })

  test('sound stops', () => {
    const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'stop')
    const result: any = inst.stopSounds([Sounds.CALL])

    expect(spy).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })

  test('sound is playing', () => {
    const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'playing')
    const result: any = inst.isPlaying(Sounds.CALL)

    expect(spy).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })

  test('change volume level of sound', () => {
    const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'volume')
    const result: any = inst.changeLevels(volume)

    expect(spy).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })

  test('set mute sounds', () => {
    const spy = jest.spyOn(Howler, 'mute')
    inst.setMuteSounds(false)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(false)
  })
})
