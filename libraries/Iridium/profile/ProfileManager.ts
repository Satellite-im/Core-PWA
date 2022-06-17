import { IridiumManager } from '../IridiumManager'
import { Profile } from './types'

export default class IridiumProfile {
  public readonly iridium: IridiumManager
  public state: Profile

  constructor(iridium: IridiumManager) {
    this.iridium = iridium
  }

  async load() {
    this.state = await this.iridium.connector?.get('/profile')
    // TODO: verify schema of profile data, recover from invalid data
  }

  get(path: string, options: any = {}) {
    return this.iridium.connector?.get(`/profile/${path}`)
  }

  set(path: string, payload: any, options: any = {}) {
    return this.iridium.connector?.set(`/profile/${path}`, payload)
  }
}
