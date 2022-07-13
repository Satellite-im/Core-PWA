import { Iridium, Emitter } from '@satellite-im/iridium'
import type {
  IridiumPeerMessage,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IridiumManager } from '../IridiumManager'
import {
  Friend,
  FriendRequest,
  FriendRequestStatus,
  FriendsError,
  User,
} from './types'
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
          await this.requestSend(did)
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

  async getFriends(): Promise<{ [key: string]: Friend }> {
    return this.state.details || {}
  }

  private async onFriendActivity(
    message: IridiumPeerMessage<IridiumFriendEvent>,
  ) {
    const { from, payload } = message
    const { to, at, status, user } = payload
    // if (Date.now() - at > 1000 * 60 * 60) {
    //   logger.warn('iridium/friends', 'ignoring old friend activity')
    //   return
    // }
    if (to !== this.iridium.connector?.id) return
    const did = Iridium.peerIdToDID(from)
    const request = await this.getRequest(did).catch(() => undefined)
    if (!request && status === 'pending') {
      await this.requestCreate(did, true, user)
    } else if (request && status === 'rejected') {
      await this.removeUserData(did, request, true)
    } else if (request) {
      request.status = status
      await this.requestSave(did, request, true)
    }
    if (request && user) {
      await this.requestSetUserData(did, user)
    }
  }

  get<T = any>(path: string, options: IridiumGetOptions = {}): Promise<T> {
    if (!this.iridium.connector) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    return this.iridium.connector?.get<T>(
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

  getRequest(id: string): Promise<FriendRequest> {
    return this.get<FriendRequest>(`/requests/${id}`)
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

  async requestCreate(remotePeerDID: string, incoming = false, user: User) {
    if (this.isFriend(remotePeerDID)) {
      logger.error('iridium/friends', 'already a friend', { remotePeerDID })
      throw FriendsError.FRIEND_EXISTS
    }
    if (this.hasRequest(remotePeerDID)) {
      logger.error('iridium/friends', 'request already exists')
      throw FriendsError.REQUEST_ALREADY_SENT
    }
    logger.info('iridium/friends', 'creating friend request', {
      remotePeerDID,
      incoming,
    })
    const request: FriendRequest = {
      user: user || { did: remotePeerDID, name: remotePeerDID },
      status: 'pending',
      incoming,
      at: Date.now(),
    }
    return this.requestSave(remotePeerDID, request, incoming)
  }

  async requestSave(
    remotePeerDID: string,
    request: FriendRequest,
    incoming = false,
  ) {
    logger.info('iridium/friends', 'saving friend request', {
      remotePeerDID,
      request,
    })
    await this.set(`/requests/${remotePeerDID}`, request)
    if (!incoming) {
      await this.requestSend(remotePeerDID)
    }
    const { user, status } = request
    if (user && status === 'accepted') {
      await this.add(user)
    }
    this.emit('request/changed', request) // TODO: separate event for create?
    return request
  }

  async requestSend(remotePeerDID: string) {
    if (!this.iridium.connector) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const request = await this.getRequest(remotePeerDID)
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const payload = {
      to: remotePeerDID,
      ...request,
      user: {
        did: this.iridium.connector.id,
        peerId: this.iridium.connector.peerId,
        name: profile.name,
        photoHash: profile.photoHash,
      },
    }
    logger.info('iridium/friends', 'sending friend request', {
      remotePeerDID,
      payload,
    })
    return this.send(payload)
  }

  async removeUserData(did: string, request: FriendRequest, incoming = false) {
    const friend = this.getFriend(did)
    request.status = 'rejected'

    if (!friend) {
      return this.requestSave(did, request, incoming)
    }

    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    const list = this.state?.list?.filter((f) => f !== did)
    const detailsList = Object.fromEntries(
      Object.entries(this.state?.details || []).filter(([key]) => key !== did),
    )

    await this.set('/list', list)
    await this.set(`/details`, detailsList)

    return this.requestSave(did, request, incoming)
  }

  async requestSetUserData(remotePeerDID: string, user: User) {
    const request = await this.getRequest(remotePeerDID)
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    request.user = user
    return this.requestSave(remotePeerDID, request, true)
  }

  async requestReject(remotePeerDID: string, incoming = false) {
    const request = await this.getRequest(remotePeerDID)
    if (!request || request.status !== 'pending') {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    request.status = 'rejected'
    return this.requestSave(remotePeerDID, request, incoming)
  }

  async requestAccept(remotePeerDID: string, incoming = false) {
    const request = await this.getRequest(remotePeerDID)
    if (!request || request.status !== 'pending') {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    request.status = 'accepted'
    return this.requestSave(remotePeerDID, request, incoming)
  }

  async add(user: User) {
    if (!this.state.list) {
      this.state.list = []
    }
    if (!this.state.details) {
      this.state.details = {}
    }

    if (!this.iridium.connector) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    if (
      this.isFriend(user.did) &&
      this.state.details[user.did].name === user.name
    ) {
      throw new Error(`already friends with ${user.did}`)
    }

    this.state.list.push(user.did)
    this.state.details[user.did] = user
    const pid = user.peerId || (await Iridium.DIDToPeerId(user.did))
    await this.iridium.connector.followPeer(pid.toString())
    await this.set(`/details/${user.did}`, user)
    return this.set('/list', this.state.list)
  }

  async remove(friendId: string) {
    if (!this.iridium.connector) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const request = await this.getRequest(friendId)
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    this.removeUserData(friendId, request, request.incoming)

    request.status = 'rejected'
    const payload = {
      to: friendId,
      ...request,
    }
    logger.info('iridium/friends', 'removing friend', {
      friendId,
      payload,
    })

    return this.send(payload)
  }

  isRequest(data: object): data is FriendRequest {
    return Object.hasOwn(data, 'user')
  }
}
