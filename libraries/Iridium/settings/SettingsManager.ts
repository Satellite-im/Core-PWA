import { Emitter } from '@satellite-im/iridium'
import merge from 'deepmerge'
import iridium from '../IridiumManager'
import { setInObject } from '../utils'
import {
  ThemeKeys,
  FlairKeys,
  LanguageKeys,
  Settings,
  defaultKeybinds,
  defaultSounds,
} from './types'
import { overwriteMerge } from '~/utilities/merge'

const initialState: Settings = {
  theme: ThemeKeys.DEFAULT,
  flair: FlairKeys.SATELLITE,
  language: LanguageKeys.EN_US,
  video: {
    flipLocalStream: true,
  },
  audio: {
    sounds: { ...defaultSounds },
  },
  keybinds: { ...defaultKeybinds },
  privacy: {
    embeddedLinks: true,
    displayCurrentActivity: true,
    consentToScan: false,
    blockNsfw: true,
  },
}

export default class SettingsManager extends Emitter {
  public state: Settings

  constructor() {
    super()
    this.state = initialState
  }

  async init() {
    await this.fetch()
  }

  private async fetch() {
    const fetched = await this.get()
    if (!fetched) {
      return fetched
    }
    this.state = merge(initialState, fetched, {
      arrayMerge: overwriteMerge,
    })
  }

  get(path: string = '', options: any = {}) {
    return iridium.connector?.get<Settings>(`/settings${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    const didSet = setInObject(this.state, path, payload)
    if (!didSet) {
      return
    }
    return iridium.connector?.set(`/settings${path}`, payload, options)
  }
}
