import Vue from 'vue'
import { v4 } from 'uuid'
import {
  IridiumPeerIdentifier,
  Emitter,
  didUtils,
  encoding,
} from '@satellite-im/iridium'
import type {
  IridiumMessage,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IridiumManager } from '../IridiumManager'
import { User, UsersError } from './types'
import logger from '~/plugins/local/logger'
import { FriendRequestStatus } from '~/libraries/Iridium/friends/types'

export type IridiumUserEvent = {
  to: IridiumPeerIdentifier
  status: FriendRequestStatus
  user: User
  data?: any
  at: number
}

export type UserState = { [key: User['did']]: User }

export type IridiumUserPubsub = IridiumMessage<IridiumUserEvent>

export default class UsersManager extends Emitter<IridiumUserPubsub> {
  public readonly iridium: IridiumManager
  public state: UserState = {}

  private loggerTag = 'iridium/users'

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  get list() {
    return Object.values(this.state)
  }

  async init() {
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize users, no iridium connector')
    }

    logger.log(this.loggerTag, 'initializing')
    const pubsub = iridium.pubsub.subscriptions()
    logger.info(this.loggerTag, 'pubsub', pubsub)
    await this.fetch()
    logger.log(this.loggerTag, 'users state loaded', this.state)
    logger.info(this.loggerTag, 'subscribing to announce topic')
    await iridium.subscribe('/users/announce')
    iridium.pubsub.on('/users/announce', this.onUsersAnnounce.bind(this))
    logger.log(this.loggerTag, 'listening for user activity', this.state)
    // connect to all users
    if (this.list) {
      logger.info(this.loggerTag, 'connecting to users', this.list)
      this.list.forEach(async (user: User) => {
        if (user && !iridium.p2p.hasPeer(user.did)) {
          logger.info(this.loggerTag, 'registering peer with iridium', user)
          iridium.p2p.addPeer({ did: user.did, type: 'peer' })
        }
      })
    }

    logger.info(this.loggerTag, 'initialized', this)
    this.emit('ready', {})
  }

  async unsubscribe() {
    await this.iridium.connector?.pubsub.unsubscribe(`/users/announce`)
  }

  /**
   * @method fetch
   * @description fetch remote state
   * @returns updated state
   */
  async fetch() {
    this.state = {
      ...this.state,
      ...(await this.get('/')),
    }
    return this.state
  }

  async getUsers(): Promise<{ [key: string]: User }> {
    return this.state || {}
  }

  private async onUsersAnnounce(message: IridiumMessage<IridiumUserEvent>) {
    const { from, payload } = message
    const { status } = payload.body

    if (status === 'removed') {
      await this.userRemove(from)
    }

    return this.state
  }

  /**
   * @method get
   * @description get remote state
   * @param path string (required)
   * @param options object
   * @returns iridium's connector result
   */
  get<T = any>(path: string, options: IridiumGetOptions = {}): Promise<T> {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }
    return this.iridium.connector?.get<T>(
      `/users${path === '/' ? '' : path}`,
      options,
    )
  }

  /**
   * @method set
   * @description updates remote state
   * @param path string (required)
   * @param payload any (required)
   * @param options object
   * @returns iridium's connector result
   */
  set(path: string, payload: any, options: IridiumSetOptions = {}) {
    logger.info(this.loggerTag, 'path, paylaod and state', {
      path,
      payload,
      state: this.state,
    })

    return this.iridium.connector?.set(
      `/users${path === '/' ? '' : path}`,
      payload,
      options,
    )
  }

  /**
   * @method hasUser
   * @description check on the local state if there's a user with the current id
   * @param id string (required)
   * @returns boolean
   */
  hasUser(did: IridiumPeerIdentifier) {
    return did && !!this.state?.[didUtils.didString(did)]
  }

  /**
   * @method getUser
   * @description check if there's a user with the current id and returns user data object
   * @param id string (required)
   * @returns user data object if found in the local state
   */
  getUser(did: IridiumPeerIdentifier) {
    return this.state[didUtils.didString(did)]
  }

  async searchPeer(did: IridiumPeerIdentifier) {
    const iridium = this.iridium.connector
    if (!iridium) {
      return
    }

    await new Promise<void>((resolve) => {
      const id = v4()
      const peerId = iridium.p2p.primaryNodeID
      if (!peerId) {
        return
      }

      this.iridium.connector?.p2p.on(
        'node/message/sync/searchPeer',
        (message) => {
          if (message.payload.body.request !== id) {
            return
          }
          logger.log('onPeerMessage', 'node/message/sync/searchPeer', message)
          const peers = message.payload.body.peers as User[]
          peers.forEach((peer) => {
            this.setUser(peer.did, peer)
          })
          resolve()
        },
      )

      iridium.p2p.send(peerId, {
        type: 'sync/searchPeer',
        id,
        did: didUtils.didString(did),
      })
    })
  }

  async setUser(did: IridiumPeerIdentifier, user: User) {
    Vue.set(this.state, didUtils.didString(did), user)
    await this.set(`/${didUtils.didString(did)}`, user)
  }

  async send(event: IridiumUserEvent) {
    return this.iridium.connector?.publish(`/users/announce`, event, {
      encrypt: {
        recipients: [
          typeof event.to === 'string' ? event.to : event.to.id,
          this.iridium.connector?.id,
        ],
      },
    })
  }

  /**
   * @method userRemove
   * @description remove a user and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @returns Promise<void>
   */
  async userRemove(did: IridiumPeerIdentifier): Promise<void> {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }

    const user = this.getUser(did)
    if (!user) {
      logger.error(this.loggerTag, 'user not found', { did })
      throw new Error(UsersError.USER_NOT_FOUND)
    }

    Vue.delete(this.state.details, didUtils.didString(did))
    await this.set(`/`, this.state)
    const id = await encoding.hash(
      [user.did, this.iridium.connector?.id].sort(),
    )
    if (id && this.iridium.chat.hasConversation(id)) {
      Vue.delete(this.iridium.chat.state.conversations, id)
    }

    logger.info(this.loggerTag, 'user removed', { did, user })

    // Announce to the remote user
    if (didUtils.didString(did) !== this.iridium.connector?.id) {
      const payload: IridiumUserEvent = {
        to: did,
        status: 'removed',
        at: Date.now(),
        user: {
          name: profile.name,
          did: profile.did,
        },
      }
      logger.info(this.loggerTag, 'announce remove user', {
        did,
        payload,
      })
      await this.send(payload)
    }
  }
}
