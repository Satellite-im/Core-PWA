import { Emitter } from '@satellite-im/iridium'
import { User } from '../Users/types'
import iridium from '../IridiumManager'
import logger from '~/plugins/local/logger'

export default class IridiumProfile extends Emitter {
  public state?: User

  async init() {
    if (!iridium) {
      throw new Error('cannot initialize profile, no iridium connector')
    }

    iridium.on('changed', this.onStateChanged.bind(this))
    await this.fetch()
    logger.info('iridium/profile', 'profile state loaded', {
      state: this.state,
    })
  }

  private async fetch() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    this.state = await this.get<User>()
    // await this.setUser()
    // TODO: verify schema of profile data, recover from invalid data
  }

  getUser(): User {
    return {
      did: this.state?.did || '',
      name: this.state?.name || this.state?.did || '',
      status: this.state?.status || '',
      photoHash: this.state?.photoHash || '',
    }
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
    return iridium.connector?.get<T>(`/profile${path}`, options)
  }

  async set(path: string = '/', payload: User, options: any = {}) {
    await iridium.connector?.set(
      `/profile${path === '/' ? '' : `/${path}`}`,
      payload,
      options,
    )
    this.state = await this.get<User>()
  }

  async setUser() {
    const id = iridium.id
    if (this.state && id) {
      await iridium.users.setUser(id, { ...this.state })
    }
  }

  async updateUser(details: Partial<User>) {
    logger.info('iridium/profile', 'updating user', { details })
    await this.set('/', { ...this.state, ...(details as User) })
    if (!this.state || !iridium.id) return
    // tell our peers via user announce
    await iridium.users.send({
      status: 'changed',
      user: {
        did: iridium.id,
        name: this.state.name,
        status: this.state.status,
      },
      at: Date.now(),
    })
  }
}
