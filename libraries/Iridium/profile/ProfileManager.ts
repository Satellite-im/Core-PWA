import { Emitter } from '@satellite-im/iridium'
import { IridiumManager } from '../IridiumManager'
import { User } from '../Users/types'

export default class IridiumProfile extends Emitter {
  public readonly iridium: IridiumManager
  public state?: User

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize profile, no iridium connector')
    }

    iridium.on('changed', this.onStateChanged.bind(this))
    await this.fetch()
  }

  private async fetch() {
    this.state = await this.iridium.connector?.get('/profile')
    this.setUser()
    // TODO: verify schema of profile data, recover from invalid data
  }

  onStateChanged(state: { path: string; value: any }) {
    if (state.path.startsWith('/profile')) {
      if (!state.value?.profile) {
        return
      }
      this.state = state.value?.profile
      this.setUser()
      this.emit('changed', state)
    }
  }

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/profile${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    return this.iridium.connector?.set(`/profile${path}`, payload, options)
  }

  setUser() {
    const id = this.iridium.connector?.id
    if (this.state && id) {
      this.iridium.users.setUser(id, this.state)
    }
  }

  async updateUser(details: Partial<User>) {
    const detailsKeys = Object.keys(details) as (keyof User)[]
    await Promise.all(
      detailsKeys.map(async (key) => {
        if (Object.prototype.hasOwnProperty.call(details, key)) {
          const value = details[key as keyof User]
          await this.set(`/${key}`, value)
        }
      }),
    )
  }
}
