import Emitter from '@satellite-im/iridium/src/emitter'
import { IridiumManager } from '../IridiumManager'
import { Profile } from './types'

export default class IridiumProfile extends Emitter {
  public readonly iridium: IridiumManager
  public state: Profile

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
    this.iridium.connector.on('state:changed', this.onStateChanged.bind(this))
  }

  async load() {
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
