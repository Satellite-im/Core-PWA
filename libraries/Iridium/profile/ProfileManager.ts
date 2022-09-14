import { Emitter } from '@satellite-im/iridium'
import { User } from '../Users/types'
import iridium from '../IridiumManager'
import logger from '~/plugins/local/logger'

export default class IridiumProfile extends Emitter {
  public state?: User
  public ready?: boolean = false

  async init() {
    if (!iridium) {
      throw new Error('cannot initialize profile, no iridium connector')
    }

    logger.info('iridium/profile', 'profile init')
    iridium.connector?.on('changed', this.onStateChanged.bind(this))
    await this.fetch()
    this.ready = true
    this.emit('ready', this.state)
    logger.info('iridium/profile', 'profile state loaded', {
      state: this.state,
    })
  }

  private async fetch() {
    this.state = await this.get<User>()
    await this.setUser()
    // TODO: verify schema of profile data, recover from invalid data
  }

  getUser(): User {
    return {
      did: this.state?.did || '',
      name: this.state?.name || '',
      status: this.state?.status || '',
      photoHash: this.state?.photoHash || '',
    }
  }

  onStateChanged(state: { path: string; value: any }) {
    logger.info('iridium/profile', 'state changed', { state })
    if (state.path.startsWith('/profile')) {
      if (!state.value?.profile || !state.value?.profile?.did) {
        logger.info(
          'iridium/profile',
          'profile state changed, but profile not detected',
        )
        return
      }
      logger.info('iridium/profile', 'profile state changed', state)
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
  }

  async setUser() {
    const id = iridium.id
    if (this.state && id && iridium.users.ready) {
      await iridium.users.setUser(id, { ...this.state })
    }
  }

  async updateUser(details: Partial<User>) {
    logger.info('iridium/profile', 'updating user', { details })
    for (const [key, value] of Object.entries(details)) {
      this.state[key] = value
    }

    await this.set('/', { ...this.state, ...(details as User) })
    if (!this.state || !iridium.id) return
    // tell our peers via user announce
    await iridium.users.send({
      status: 'online',
      user: {
        did: iridium.id,
        name: this.state.name,
        status: this.state.status,
      },
      at: Date.now(),
    })
  }
}
