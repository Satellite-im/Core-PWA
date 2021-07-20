import { Howl } from 'howler'
import { Config } from '~/config'

// Keep this type in sync with Config.sounds
export enum Sounds {
  NewMessage = 'newMessage',
  Call = 'call',
  Hangup = 'hangup',
  Mute = 'mute',
  Unmute = 'unmute',
  Deafen = 'deafen',
  Undeafen = 'undeafen',
  Upload = 'upload',
  Connected = 'connected',
}

/**
 * Class representing a Soundmanager
 * @class SoundManager
 */
export default class SoundManager {
  sounds: Record<Sounds, Howl>
  /**
   * @constructs SoundManager
   */
  constructor() {
    this.sounds = {} as Record<Sounds, Howl>
    for (const [key, value] of Object.entries(Config.sounds) as [
      Sounds,
      string
    ][]) {
      this.sounds[key] = new Howl({
        src: [`${Config.ipfs.browser}${value}`],
        loop: false,
        volume: 0.8,
        html5: true,
      })
    }
  }

  /** @function
   * Plays a specified sound
   * @name play
   * @argument sound Name of the sound file to play.
   * @returns null
   */
  playSound(sound: Sounds) {
    if (!this.sounds[sound]) {
      console.error('Sound not found')
      return
    }

    this.sounds[sound].play()
  }

  /** @function
   * Stops a specified sound
   * @name stop
   * @argument sound Name of the sound file to play.
   * @returns null
   */
  stopSound(sound: Sounds) {
    if (!this.sounds[sound]) {
      console.error('Sound not found')
      return
    }

    this.sounds[sound].stop()
  }

  /** @function
   * Checks if the sound is currently playing
   * @name isPlaying
   * @argument sound Name of the sound file to play.
   * @returns boolean
   */
  isPlaying(sound: Sounds): boolean {
    if (!this.sounds[sound]) {
      console.error('Sound not found')
      return false
    }

    return this.sounds[sound].playing()
  }
}
