import { Emitter, Iridium } from '@satellite-im/iridium'
import type {
  IridiumGetOptions,
  IridiumPeerMessage,
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
    list: string[]
    details: { [key: string]: Friend }
    requests: FriendRequest[]
  } = { list: [], details: {}, requests: [] }

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
    // const pubsub = await iridium.ipfs.pubsub.ls()
    // logger.info('iridium/friends', 'pubsub', pubsub)
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
        }
      })
    }

    if (this.state.requests.length) {
      logger.info(
        'iridium/friends',
        'connecting to requested friends',
        this.state.requests,
      )
      // this.state.requests.forEach(async (request) => {
      //   if (request.status === 'pending' && !request.incoming) {
      //     await this.requestSend(request.user.did)
      //   }
      // })
    }
    // this.emit('ready', {})
  }

  async fetch() {
    const res = await this.get('/')
    if ('requests' in res) {
      this.state = { ...this.state, ...res }
    }
    return this.state
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

  // async stop() {
  //   await this.iridium.connector?.unsubscribe(`/friends/announce`)
  // }

  // REQUESTS LOGIC

  // getRequests(): FriendRequest[] {
  //   return this.state.requests || []
  // }

  hasRequest(id: string) {
    const req = this.state.requests.find((r) => r.user.did === id)
    if (!req) return false

    return req.status !== 'rejected'
  }

  // FRIENDS LOGIC

  // getFriends(): { [key: string]: Friend } {
  //   return this.state.details || {}
  // }

  isFriend(id: string) {
    return this.state.list.includes(id)
  }

  hasFriendDetails(id: string) {
    return Boolean(this.state.details[id])
  }

  getFriend(id: string) {
    return this.state.details[id]
  }

  private async onFriendActivity(
    message: IridiumPeerMessage<IridiumFriendEvent>,
  ) {
    console.log('req:onFriendActivity', message)
    const { from, payload, did } = message
    const { to, status, user } = payload
    // if (Date.now() - at > 1000 * 60 * 60) {
    //   logger.warn('iridium/friends', 'ignoring old friend activity')
    //   return
    // }
    if (to !== this.iridium.connector?.id) return
    console.log(payload)
    const request = this.getRequest(did)
    if (status === 'pending') {
      await this.requestUpsert(did, true, user)
    } else if (status === 'removed') {
      await this.removeUserFromState(did)
    } else if (request && status === 'rejected') {
      await this.removeUserData(did, request, true)
    } else if (request) {
      request.status = status
      await this.requestSave(did, request, true)
    }
    // if (request && user) {
    //   await this.requestSetUserData(did, user)
    // }

    console.log('req:state', this.state)
  }

  getRequest(id: string): FriendRequest | undefined {
    return this.state.requests.find((r) => r.user.did === id)
    // return this.get<FriendRequest>(`/requests/${id}`)
  }

  send(event: IridiumFriendEvent) {
    return this.iridium.connector?.broadcast(`/friends/announce`, event, {
      encrypt: {
        recipients: [event.to, this.iridium.connector?.id],
      },
    })
  }

  // broadcast(event: IridiumFriendEvent) {
  //   return this.iridium.connector?.broadcast(`/friends/announce`, event)
  // }

  async requestUpsert(remotePeerDID: string, incoming = false, user: User) {
    console.log('req:create', remotePeerDID)
    if (this.isFriend(remotePeerDID)) {
      logger.error('iridium/friends', 'already a friend', { remotePeerDID })
      throw new Error(FriendsError.FRIEND_EXISTS)
    }
    if (this.hasRequest(remotePeerDID)) {
      logger.error('iridium/friends', 'request already exists')
      throw new Error(FriendsError.REQUEST_ALREADY_SENT)
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
    console.log('req:save', remotePeerDID, incoming)
    logger.info('iridium/friends', 'saving friend request', {
      remotePeerDID,
      request,
    })
    const stateReq = this.getRequest(remotePeerDID)
    const reqs = this.state.requests
    // If its alreay present, remove and push to mantain reactivity
    if (stateReq) {
      const index = this.state.requests.indexOf(stateReq)
      reqs.splice(index, 1)
    }
    reqs.push(request)

    console.log('req:reqs', reqs)
    await this.set(`/requests`, this.state.requests)
    if (!incoming) {
      await this.requestSend(request)
    }
    const { user, status } = request
    if (user && status === 'accepted') {
      await this.add(user)
    }

    return request
  }

  async requestSend(request: FriendRequest) {
    console.log('req:requestSend', request)
    if (!this.iridium.connector) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    // const request = await this.getRequest(remotePeerDID)
    // if (!request) {
    //   throw new Error(FriendsError.REQUEST_NOT_FOUND)
    // }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const payload = {
      to: request.user.did,
      ...request,
      user: {
        did: this.iridium.connector.id,
        peerId: this.iridium.connector.peerId,
        name: profile.name,
        photoHash: profile.photoHash,
      },
    }
    logger.info('iridium/friends', 'sending friend request', {
      remotePeerDID: request.user.did,
      payload,
    })
    return this.send(payload)
  }

  async removeUserData(did: string, request: FriendRequest, incoming = false) {
    const friend = this.getFriend(did)

    if (!friend) {
      request.status = 'rejected'
      return this.requestSave(did, request, incoming)
    }

    await this.removeUserFromState(did)

    return this.requestSave(did, request, incoming)
  }

  async requestSetUserData(remotePeerDID: string, user: User) {
    const request = this.getRequest(remotePeerDID)
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    console.log('req:setuserdata', request.user)
    console.log('req:setuserdata', user)
    request.user = user
    return this.requestSave(remotePeerDID, request, true)
  }

  async requestReject(remotePeerDID: string) {
    const request = this.getRequest(remotePeerDID)
    console.log('req:rejects', request)
    console.log('req:rejects', this.state.requests, remotePeerDID)
    if (!request || request.status !== 'pending') {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    request.status = 'rejected'
    return this.requestSave(remotePeerDID, request, false)
  }

  async requestAccept(remotePeerDID: string) {
    const request = this.getRequest(remotePeerDID)
    if (!request || request.status !== 'pending') {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    request.status = 'accepted'
    return this.requestSave(remotePeerDID, request, false)
  }

  async add(user: User) {
    console.log('req:add', user, this.state.list)
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

  async removeUserFromState(remotePeerDID: string) {
    console.log('req:remove', remotePeerDID)
    const friend = this.getFriend(remotePeerDID)
    if (!friend) {
      throw new Error(FriendsError.FRIEND_NOT_FOUND)
    }

    const friendIndex = this.state.list.findIndex((f) => f === remotePeerDID)
    this.state.list.splice(friendIndex, 1)

    const details = this.state.details
    delete details[remotePeerDID]

    // const detailsList = Object.fromEntries(
    //   Object.entries(this.state.details).filter(
    //     ([key]) => key !== remotePeerDID,
    //   ),
    // )

    await this.set('/list', this.state.list)
    await this.set(`/details`, details)
  }

  async removeFriend(remotePeerDID: string) {
    if (!this.iridium.connector) {
      throw new Error(FriendsError.NETWORK_ERROR)
    }

    await this.removeUserFromState(remotePeerDID)

    const payload: IridiumFriendEvent = {
      to: remotePeerDID,
      status: 'removed',
      at: Date.now(),
      user: {
        did: this.iridium.connector.id,
        peerId: this.iridium.connector.peerId,
      },
    }
    logger.info('iridium/friends', 'removing friend', {
      remotePeerDID,
      payload,
    })

    return this.send(payload)
  }

  isRequest(data: object): data is FriendRequest {
    return Object.hasOwn(data, 'user')
  }
}
