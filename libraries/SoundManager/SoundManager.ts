import { Howl } from 'howler'
import { SoundsState, SoundsTypes } from '~/store/sounds/types'
import { Config } from '~/config'

// Keep this type in sync with Config.sounds
export enum Sounds {
  NEW_MESSAGE = 'newMessage',
  CALL = 'call',
  HANGUP = 'hangup',
  MUTE = 'mute',
  UNMUTE = 'unmute',
  DEAFEN = 'deafen',
  UNDEAFEN = 'undeafen',
  UPLOAD = 'upload',
  CONNECTED = 'connected',
}

/**
 * Class representing a SoundManager
 * @class SoundManager
 */
export default class SoundManager {
  sounds: Record<Sounds, Howl>
  soundsFlag: Record<Sounds, boolean>
  /**
   * @constructs SoundManager
   */
  constructor(soundsState: SoundsState | null = null, volume: number = 1.0) {
    //
    // Init 'sounds' property
    //
    this.sounds = {} as Record<Sounds, Howl>
    for (const [key, value] of Object.entries(Config.sounds) as [
      Sounds,
      string,
    ][]) {
      this.sounds[key] = new Howl({
        src: [`${Config.ipfs.gateway}${value}`],
        loop: Config.sounds.doesLoop.includes(key),
        volume,
        html5: true,
        preload: true,
      })
    }

    //
    // initialize 'soundsMuteFlag' property
    //
    // TODO: put some optimized code instead of manual putting
    this.soundsFlag = {} as Record<Sounds, boolean>
    if (soundsState == null) return
    this.soundsFlag[Sounds.NEW_MESSAGE] = soundsState[SoundsTypes.message]
    this.soundsFlag[Sounds.CALL] = soundsState[SoundsTypes.call]
    this.soundsFlag[Sounds.HANGUP] = true // no hangup related notification setting ? default: true
    this.soundsFlag[Sounds.MUTE] = soundsState[SoundsTypes.mute]
    this.soundsFlag[Sounds.UNMUTE] = soundsState[SoundsTypes.mute]
    this.soundsFlag[Sounds.DEAFEN] = soundsState[SoundsTypes.deafen]
    this.soundsFlag[Sounds.UNDEAFEN] = soundsState[SoundsTypes.undeafen]
    this.soundsFlag[Sounds.UPLOAD] = soundsState[SoundsTypes.upload]
    this.soundsFlag[Sounds.CONNECTED] = soundsState[SoundsTypes.connected]
  }

  /**
   * @function
   * init 'sounds' property
   * @param volume
   */
  private initSounds(volume: number = 1.0) {}
  /** @function
   * Check if a specific sound exists
   * @param sound Name of the sound to check
   */
  private existsSound(sound: Sounds) {
    if (!this.sounds[sound]) {
      throw new Error('Sound not found')
    }
  }

  /** @function
   * Plays a specified sound
   * @name play
   * @argument sound Name of the sound file to play.
   * @returns null
   */
  playSound(sound: Sounds) {
    this.existsSound(sound)

    if (this.soundsFlag[sound] === false) return // if sound is muted then dont play

    this.sounds[sound].play()
  }

  /** @function
   * Stops a specified sound
   * @name stop
   * @argument sound Name of the sound file to play.
   * @returns null
   */
  stopSound(sound: Sounds) {
    this.existsSound(sound)

    this.sounds[sound].stop()
  }

  /** @function
   * Checks if the sound is currently playing
   * @name isPlaying
   * @argument sound Name of the sound file to play.
   * @returns boolean | error
   */
  isPlaying(sound: Sounds): boolean {
    this.existsSound(sound)

    return this.sounds[sound].playing()
  }

  changeLevels(volume: number) {
    for (const [key] of Object.entries(Config.sounds) as [Sounds, string][]) {
      this.sounds[key].volume(volume)
    }
  }
}
