import { Howl, Howler } from 'howler'
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

  /**
   * @constructs SoundManager
   */
  constructor(volume: number = 1.0) {
    this.sounds = {} as Record<Sounds, Howl>
    for (const [key, value] of Object.entries(Config.sounds) as [
      Sounds,
      string,
    ][]) {
      this.sounds[key] = new Howl({
        src: [value],
        loop: Config.sounds.doesLoop.includes(key),
        volume,
        html5: true,
        preload: true,
      })
    }
  }

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
    this.sounds[sound].play()
  }

  /** @function
   * Stops specified sounds
   * @name stopSounds
   * @argument soundList Array of the sound file to stop.
   * @returns null
   */
  stopSounds(soundList: Array<Sounds>) {
    soundList.forEach((sound: Sounds) => {
      if (this.playingSounds().includes(sound)) {
        this.sounds[sound].stop()
      }
    })
  }

  /** @function
   * Pauses specified sounds
   * @name playingSounds
   * @returns array of sounds that are currently playing
   */
  playingSounds() {
    return Object.keys(this.sounds).filter((s: string) => this.isPlaying(s))
  }

  setMuteSounds(flag: boolean) {
    Howler.mute(flag)
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
