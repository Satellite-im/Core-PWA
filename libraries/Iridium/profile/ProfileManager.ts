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
    iridium.logger.info('iridium/profile', 'profile state loaded', {
      state: this.state,
    })
  }

  private async fetch() {
    this.state = await this.get<User>()
    await this.setUser()
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

  get<T = any>(path: string = '', options: any = {}) {
    return this.iridium.connector?.get<T>(`/profile${path}`, options)
  }

  async set(path: string = '', payload: any, options: any = {}) {
    await this.iridium.connector?.set(`/profile${path}`, payload, options)
    this.state = await this.get<User>()
  }

  async setUser() {
    const id = this.iridium.connector?.id
    if (this.state && id) {
      await this.iridium.users.setUser(id, { ...this.state })
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
