import { Emitter } from '@satellite-im/iridium'
import { IridiumManager } from '../IridiumManager'
import { Profile } from './types'

export default class IridiumProfile extends Emitter {
  public readonly iridium: IridiumManager
  public state: Profile

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize profile, no iridium connector')
    }

    iridium.on('state:changed', this.onStateChanged.bind(this))
    await this.fetch()
  }

  private async fetch() {
    this.state = await this.iridium.connector?.get('/profile')
    // TODO: verify schema of profile data, recover from invalid data
  }

  onStateChanged(state: { path: string; value: any }) {
    if (state.path.startsWith('/profile')) {
      this.emit('changed', state)
    }
  }

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/profile${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    return this.iridium.connector?.set(`/profile${path}`, payload, options)
  }
}
