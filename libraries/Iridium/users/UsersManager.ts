import { v4 } from 'uuid'
import {
  IridiumPeerIdentifier,
  Emitter,
  didUtils,
  encoding,
  IridiumPubsubMessage,
} from '@satellite-im/iridium'
import type {
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import iridium from '../IridiumManager'
import { User, UsersError, UserStatus } from './types'
import logger from '~/plugins/local/logger'

export type IridiumUserEvent = {
  to?: IridiumPeerIdentifier
  name?: string
  status: UserStatus | 'changed' | 'removed'
  user: User
  data?: any
  at: number
}

export type UserState = { [key: User['did']]: User }

export type IridiumUserPubsub = IridiumPubsubMessage<
  IridiumDecodedPayload<IridiumUserEvent>
>

export default class UsersManager extends Emitter<IridiumUserPubsub> {
  public state: UserState = {}
  public ephemeral: { status: { [key: string]: UserStatus } } = { status: {} }
  public ready: boolean = false

  private loggerTag = 'iridium/users'

  get list() {
    return Object.values(this.state)
  }

  async init() {
    if (!iridium.connector) {
      throw new Error('cannot initialize users, no iridium connector')
    }

    logger.log(this.loggerTag, 'initializing')
    await this.fetch()

    iridium.connector?.on('/peer/announce', (message: IridiumPubsubMessage) => {
      iridium.users.setUserStatus(
        message.from,
        message.payload.body.status || 'online',
      )
    })

    logger.log(this.loggerTag, 'fetched', this.state)
    this.ephemeral.status = Object.keys(this.state).reduce(
      (acc, did) => ({ ...acc, [did]: 'offline' }),
      {},
    )
    logger.info(this.loggerTag, 'subscribing to announce topic')
    iridium.connector.subscribe<IridiumUserPubsub>('/users/announce', {
      handler: this.onUsersAnnounce.bind(this),
      sync: true,
      decode: false,
    })
    logger.log(this.loggerTag, 'listening for user activity', this.state)

    iridium.connector?.p2p.on('peer/disconnect', (peer) => {
      logger.info(this.loggerTag, 'peer disconnected', peer)
      this.setUser(peer.did, {
        ...this.state[peer.did],
        seen: Date.now(),
      })
      this.setUserStatus(peer.did, 'offline')
    })

    await this.loadUserData()
    setInterval(async () => {
      await this.loadUserData()
    }, 1800000)

    iridium.connector?.p2p.on('node/message/sync/searchPeer', (message) => {
      const peers = message.payload.body.peers as User[]
      peers.forEach((peer) => {
        this.setUser(peer.did, peer)
      })
      this.emit(
        `searchResults${
          message.payload.body.request ? `/${message.payload.body.request}` : ''
        }`,
        peers,
      )
    })

    logger.info(this.loggerTag, 'initialized')
    this.ready = true
    return this.emit('ready', { users: this.state })
  }

  async stop() {
    // announce that we're going offline
    const user = iridium.profile.getUser()
    logger.info(this.loggerTag, 'sending offline status announcement', {
      user,
    })
    await this.send({
      user: iridium.profile.getUser(),
      status: 'offline',
      at: Date.now(),
    })
  }

  async loadUserData() {
    this.list.forEach(async (user: User) => {
      if (
        this.ephemeral.status[user.did] === 'online' &&
        Number(user.seen) < Date.now() - 1000 * 30
      ) {
        logger.info(this.loggerTag, 'user timed out', user)
        iridium.users.setUser(user.did, {
          ...user,
          seen: Date.now(),
        })
        iridium.users.setUserStatus(user.did, 'offline')
      }
    })
  }

  async unsubscribe() {
    await iridium.connector?.unsubscribe(`/users/announce`)
  }

  /**
   * @method fetch
   * @description fetch remote state
   * @returns updated state
   */
  async fetch() {
    const fetched = await this.get('/')
    this.state = { ...fetched }
  }

  async getUsers(): Promise<{ [key: string]: User }> {
    return this.state || {}
  }

  private async onUsersAnnounce(message: IridiumUserPubsub) {
    const { from, payload } = message
    const { status, user } = payload.body
    logger.info(this.loggerTag, 'user announce', { from, status, user })

    if (status === 'removed') {
      return this.userRemove(from)
    }

    // update profile name
    const localUser = this.getUser(from) as User
    if (user && user.name) {
      logger.info(this.loggerTag, 'updating user details', {
        from,
        name: user.name,
        status: this.ephemeral.status[user.did],
      })
      this.setUserStatus(user.did, (status || 'offline') as UserStatus)
      await this.setUser(from, {
        ...localUser,
        name: user.name || localUser.name,
      })
    }
  }

  /**
   * @method get
   * @description get remote state
   * @param path string (required)
   * @param options object
   * @returns iridium's connector result
   */
  get<T = any>(path: string, options: IridiumGetOptions = {}): Promise<T> {
    if (!iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }
    return iridium.connector?.get<T>(
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

    return iridium.connector?.set(
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
    const id = didUtils.didString(did)
    logger.info(this.loggerTag, 'has user', {
      id,
      hasUser: id && !!this.state[id],
    })
    return id && !!this.state?.[id]
  }

  /**
   * @method getUser
   * @description check if there's a user with the current id and returns user data object
   * @param id string (required)
   * @returns user data object if found in the local state
   */
  getUser(did: IridiumPeerIdentifier): User | undefined {
    if (did.toString() === iridium.connector?.id) {
      return iridium.profile.state
    }
    return this.state[didUtils.didString(did)]
  }

  async searchPeer(query: string, page: number = 0): Promise<User[]> {
    if (!iridium.connector) {
      logger.error(this.loggerTag, 'network error (no connector)')
      return []
    }

    return new Promise<User[]>((resolve) => {
      const id = v4()
      if (
        !iridium.connector?.p2p.primaryNodeID ||
        !iridium.connector?.p2p.nodeReady
      ) {
        logger.warn('iridium/usermanager', 'no primary node, cannot search', {
          primaryNodeID: iridium?.connector?.p2p.primaryNodeID,
          p2pReady: iridium?.connector?.p2p.ready,
          iridiumReady: iridium?.ready,
        })
        return resolve([])
      }

      const timeout = setTimeout(() => {
        logger.warn(this.loggerTag, 'peer search timeout', { query })
        resolve([])
      }, 5000)

      this.once(`searchResults/${id}`, (results: User[]) => {
        logger.debug(this.loggerTag, 'search results received', results)
        clearTimeout(timeout)
        resolve(results)
      })

      logger.info(this.loggerTag, 'peer search query', { query, page, id })
      iridium.connector.p2p.send(iridium.connector.p2p.primaryNodeID, {
        type: 'sync/searchPeer',
        id,
        query,
        page,
      })
    })
  }

  async setUser(id: IridiumPeerIdentifier, user: User) {
    const did = didUtils.didString(id)
    this.state = { ...this.state, [did]: { ...this.state[did], ...user } }

    // rename chat conversations
    if (user.name) {
      const conversations = await iridium.chat.state.conversations
      Object.keys(conversations)
        .filter((key) => {
          const others = conversations[key].participants.filter(
            (p) => p !== iridium.id,
          )
          return others.length === 1 && others[0] === did
        })
        .forEach((conversationId) => {
          iridium.chat.state.conversations[conversationId].name = user.name
        })
    }

    logger.info(this.loggerTag, 'set user', { id, user })
    await this.set('/', this.state)
  }

  setUserStatus(did: IridiumPeerIdentifier, status: UserStatus) {
    this.ephemeral.status[didUtils.didString(did)] = status || 'offline'
  }

  getUserStatus(did: IridiumPeerIdentifier) {
    return this.ephemeral.status[didUtils.didString(did)]
  }

  async send(event: IridiumUserEvent) {
    return iridium.connector?.publish(`/users/announce`, event)
  }

  /**
   * @method userRemove
   * @description remove a user and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @returns Promise<void>
   */
  async userRemove(did: IridiumPeerIdentifier): Promise<void> {
    if (!iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }
    const profile = await iridium.profile?.get()
    if (!profile) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }

    const user = this.getUser(did)
    if (!user) {
      logger.error(this.loggerTag, 'user not found', { did })
      throw new Error(UsersError.USER_NOT_FOUND)
    }

    delete this.state[didUtils.didString(did)]
    this.state = { ...this.state }
    await this.set(`/`, this.state)
    const id = await encoding.hash([user.did, iridium.id].sort())
    if (id && iridium.chat.hasConversation(id)) {
      iridium.chat.deleteConversation(id)
    }

    logger.info(this.loggerTag, 'user removed', { did, user })

    // Announce to the remote user
    if (didUtils.didString(did) !== iridium.id) {
      const payload: IridiumUserEvent = {
        to: did,
        status: 'removed',
        at: Date.now(),
        user: {
          name: profile.name,
          did: profile.did,
          status: profile.status || '',
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
