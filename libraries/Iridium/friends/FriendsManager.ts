import Iridium from '@satellite-im/iridium/dist/index.browser'
import { Emitter } from '@satellite-im/iridium/src/emitter'
import type {
  IridiumPeerMessage,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IridiumManager } from '../IridiumManager'
import { Friend, FriendRequest, FriendRequestStatus, User } from './types'
import logger from '~/plugins/local/logger'

export type IridiumFriendEvent = {
  to: string
  status: FriendRequestStatus
  user: User
  data?: any
  at: number
}

export type IridiumFriendPubsub = IridiumPeerMessage<IridiumFriendEvent>

export default class FriendsManager extends Emitter<IridiumFriendPubsub> {
  public readonly iridium: IridiumManager
  public state: {
    list?: string[]
    details?: { [key: string]: Friend }
    requests?: { [key: string]: FriendRequest }
  } = {}

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    if (!this.iridium.connector) {
      throw new Error('cannot initialize friends, no iridium connector')
    }

    const iridium = this.iridium.connector
    logger.log('iridium/friends', 'initializing')
    const pubsub = await iridium.ipfs.pubsub.ls()
    logger.info('iridium/friends', 'pubsub', pubsub)
    await this.fetch()
    logger.log('iridium/friends', 'friends state loaded', this.state)
    logger.info('iridium/friends', 'subscribing to announce topic')
    await iridium.subscribe('/friends/announce')
    // console.info('waiting for topic peer')
    // await this.iridium.connector?.waitForTopicPeer(topic)
    this.iridium.connector?.on(
      '/friends/announce',
      this.onFriendActivity.bind(this),
    )
    logger.log('iridium/friends', 'listening for friend activity', this.state)

    // connect to all friends
    if (this.state.list) {
      logger.info('iridium/friends', 'connecting to friends', this.state.list)
      this.state.list.forEach(async (did) => {
        const peerId = await Iridium.DIDToPeerId(did)
        if (peerId && !iridium.hasPeer(peerId.toString())) {
          logger.info(
            'iridium/friends',
            'registering friendly peerId with iridium',
            {
              did,
              peerId,
            },
          )
          iridium.followPeer(peerId.toString())
          // await iridium.ipfs.swarm.connect(peerId)
        }
      })
    }

    if (this.state.requests) {
      logger.info(
        'iridium/friends',
        'connecting to requested friends',
        Object.entries(this.state.requests),
      )
      Object.entries(this.state.requests).forEach(async ([did, request]) => {
        if (request.status === 'pending' && !request.incoming) {
          logger.info(
            'iridium/friends/init',
            'connecting to requested friend',
            { did, request },
          )
          const peerId = await Iridium.DIDToPeerId(did)
          logger.info(
            'iridium/friends',
            'registering friendly peerId with iridium',
            {
              did,
              peerId,
            },
          )
          iridium.followPeer(peerId.toString())
          // await iridium.ipfs.swarm.connect(peerId)
          // remind remote user about the request
          logger.info(
            'iridium/friends/init',
            'reminding potential friend of pending request',
            { did, request },
          )
          await this.updateFriendRequest(did, 'pending')
        }
      })
    }
    this.emit('ready', {})
  }

  async stop() {
    await this.iridium.connector?.unsubscribe(`/friends/announce`)
  }

  async fetch() {
    this.state = await this.get('/')
    return this.state
  }

  async getRequests(): Promise<{ [key: string]: FriendRequest }> {
    return this.state.requests || {}
  }

  private async onFriendActivity(
    message: IridiumPeerMessage<IridiumFriendEvent>,
  ) {
    const { from, payload } = message
    const { to, at, status, user } = payload
    if (to !== this.iridium.connector?.id) return
    const did = Iridium.peerIdToDID(from)
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      logger.warn('iridium/friends', 'invalid friend request status', {
        from,
        did,
        status,
      })
      return
    }
    logger.info('iridium/friends', 'received friend request', {
      did,
      from,
      user,
      status,
    })
    const existing = this.state.requests?.[did]
    const incoming = status === 'pending' && !existing
    await this.updateFriendRequest(did, status, user, incoming)
  }

  get(path: string, options: IridiumGetOptions = {}) {
    return this.iridium.connector?.get(
      `/friends${path === '/' ? '' : path}`,
      options,
    )
  }

  set(path: string, payload: any, options: IridiumSetOptions = {}) {
    logger.info('iridium/friends', 'path and paylaod', {
      path,
      payload,
    })
    return this.iridium.connector?.set(
      `/friends${path === '/' ? '' : path}`,
      payload,
      options,
    )
  }

  isFriend(id: string) {
    return this.state.list?.includes(id)
  }

  hasFriendDetails(id: string) {
    return !!this.state.details?.[id]
  }

  getFriend(id: string) {
    return this.state.details?.[id]
  }

  hasRequest(id: string) {
    return (
      this.state.requests?.[id] &&
      this.state.requests?.[id].status !== 'rejected'
    )
  }

  getRequest(id: string) {
    return this.get(`/requests/${id}`)
  }

  async send(event: IridiumFriendEvent) {
    return this.iridium.connector?.broadcast(`/friends/announce`, event, {
      encrypt: {
        recipients: [event.to, this.iridium.connector?.id],
      },
    })
  }

  broadcast(event: IridiumFriendEvent) {
    return this.iridium.connector?.broadcast(`/friends/announce`, event)
  }

  async updateFriendRequest(
    friendId: string,
    status: FriendRequestStatus,
    user?: User,
    incoming: boolean | undefined = undefined,
  ) {
    const existing = (await this.getRequest(friendId)) || {}
    const request = {
      ...existing,
      user: user || existing?.user || null,
      status,
      incoming: incoming === undefined ? existing?.incoming || false : incoming,
      at: Date.now(),
    }
    await this.set(`/requests/${friendId}`, request)
    this.emit('request/changed', request)

    if (user && status === 'accepted' && !this.isFriend(friendId)) {
      await this.addFriend(user)
    }
    if (existing.status === status) {
      return
    }
    // update the remote user with our details
    const payload: any = {
      status,
      to: friendId,
      at: Date.now(),
    }
    const profile = await this.iridium.profile?.get('/')
    payload.user = {
      did: this.iridium.connector?.id,
      peerId: this.iridium.connector?.peerId,
      name: profile.name,
      photoHash: profile.photoHash,
    }
    logger.info('iridium/friends', 'sending friend request update', {
      friendId,
      payload,
    })
    await this.send(payload)
    return request
  }

  async addFriend(user: User) {
    if (this.isFriend(user.did)) {
      throw new Error(`already friends with ${user.did}`)
    }
    if (!this.state.list) {
      this.state.list = []
    }
    if (!this.state.details) {
      this.state.details = {}
    }
    this.state.list.push(user.did)
    this.state.details[user.did] = user
    await this.set(`/details/${user.did}`, user)
    return this.set('/list', this.state.list)
  }

  async createFriendRequest(
    friendId: string,
    status: FriendRequestStatus = 'pending',
    user?: User,
  ) {
    if (this.isFriend(friendId)) {
      throw new Error(`already friends with ${friendId}`)
    }

    if (this.hasRequest(friendId)) {
      console.info('createFriendRequest, hasRequest', friendId)
      throw new Error(`already have friend request for ${friendId}`)
    }

    return this.updateFriendRequest(friendId, status, user)
  }

  async acceptFriendRequest(friendId: string) {
    return this.updateFriendRequest(friendId, 'accepted')
  }

  async rejectFriendRequest(friendId: string) {
    return this.updateFriendRequest(friendId, 'rejected')
  }

  async removeFriend(friendId: string) {
    const friend = await this.getFriend(friendId)
    if (!friend) {
      throw new Error('friend not found')
    }
    const list = this.state?.list?.filter((f) => f !== friendId)
    await this.set('/list', list)
    await this.set(`/details/${friendId}`, undefined)
  }
}
