import { IridiumPeerIdentifier, Emitter, didUtils, encoding } from '@satellite-im/iridium'
import type {
  IridiumMessage,
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
  to: IridiumPeerIdentifier
  status: FriendRequestStatus
  user: User
  data?: any
  at: number
}

export type IridiumFriendPubsub = IridiumMessage<IridiumFriendEvent>

export default class FriendsManager extends Emitter<IridiumFriendPubsub> {
  public readonly iridium: IridiumManager
  public state: {
    details: { [key: string]: Friend }
    requests: { [key: string]: FriendRequest }
    blocked: string[]
  } = { details: {}, requests: {}, blocked: [] }

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  get list() {
    return Object.values(this.state.details || {})
  }

  get requestList() {
    return Object.values(this.state.requests || {})
  }

  async init() {
    if (!this.iridium.connector) {
      throw new Error('cannot initialize friends, no iridium connector')
    }

    const iridium = this.iridium.connector
    logger.log('iridium/friends', 'initializing')
    const pubsub = await iridium.pubsub.subscriptions()
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
    if (this.list) {
      logger.info('iridium/friends', 'connecting to friends', this.list)
      this.list.forEach(async (friend: User) => {
        if (friend && !iridium.p2p.hasPeer(friend.did)) {
          logger.info(
            'iridium/friends',
            'registering friendly peer with iridium',
            friend,
          )
          iridium.p2p.addPeer({ did: friend.did, type: 'peer' })
        }
      })
    }

    if (this.requestList.length) {
      logger.info(
        'iridium/friends',
        'connecting to requested friends',
        this.state.requests,
      )
    }
    this.emit('ready', {})
  }

  async stop() {
    await this.iridium.connector?.pubsub.unsubscribe(`/friends/announce`)
  }

  /**
   * @method fetch
   * @description fetch remote state
   * @returns updated state
   */
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

  private async onFriendActivity(message: IridiumMessage<IridiumFriendEvent>) {
    const { from, payload } = message
    const { to, at, status, user } = payload.body
    // if (Date.now() - at > 1000 * 60 * 60) {
    //   logger.warn('iridium/friends', 'ignoring old friend activity')
    //   return
    // }
    if (to !== this.iridium.connector?.id) return
    const request = await this.getRequest(from).catch(() => undefined)
    if (!request && status === 'pending') {
      await this.requestCreate(from, true, user)
    } else if (request) {
      request.status = status
      await this.requestSave(from, request, true)
    }
    if (request && user) {
      await this.requestSetUserData(from, user)
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
      logger.error('iridium/friends', 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    return this.iridium.connector?.get<T>(
      `/friends${path === '/' ? '' : path}`,
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

  /**
   * @method isFriend
   * @description check on the local state if there's a friend with the current id
   * @param id string (required)
   * @returns boolean
   */
  isFriend(did: IridiumPeerIdentifier) {
    return did && !!this.state?.details?.[didUtils.didString(did)]
  }

  /**
   * @method getFriend
   * @description check if there's a friend with the current id and returns friend data object
   * @param id string (required)
   * @returns friend data object if found in the local state
   */
  getFriend(did: IridiumPeerIdentifier) {
    return did ? this.state.details[didUtils.didString(did)] : undefined
  }

  hasRequest(did: IridiumPeerIdentifier) {
    const str = didUtils.didString(did)
    return (
      this.state.requests?.[str] &&
      this.state.requests?.[str].status !== 'rejected'
    )
  }

  getRequest(did: IridiumPeerIdentifier): Promise<FriendRequest> {
    return this.get<FriendRequest>(`/requests/${didUtils.didString(did)}`)
  }

  async send(event: IridiumFriendEvent) {
    return this.iridium.connector?.publish(`/friends/announce`, event, {
      encrypt: {
        recipients: [
          typeof event.to === 'string' ? event.to : event.to.id,
          this.iridium.connector?.id,
        ],
      },
    })
  }

  broadcast(event: IridiumFriendEvent) {
    return this.iridium.connector?.publish(`/friends/announce`, event)
  }

  async requestCreate(
    did: IridiumPeerIdentifier,
    incoming = false,
    user: User = {
      name: didUtils.didString(did),
      did: didUtils.didString(did),
    },
  ) {
    if (this.isFriend(did)) {
      logger.error('iridium/friends', 'already a friend', { did })
      throw new Error(FriendsError.FRIEND_EXISTS)
    }
    if (this.hasRequest(did)) {
      logger.error('iridium/friends', 'request already exists')
      throw new Error(FriendsError.REQUEST_ALREADY_SENT)
    }
    logger.info('iridium/friends', 'creating friend request', {
      did,
      incoming,
    })
    const request: FriendRequest = {
      user: user || { did, name: did },
      status: 'pending',
      incoming,
      at: Date.now(),
    }
    return this.requestSave(did, request, incoming)
  }

  async requestSave(
    did: IridiumPeerIdentifier,
    request: FriendRequest,
    incoming = false,
  ) {
    logger.info('iridium/friends', 'saving friend request', {
      did,
      request,
    })
    await this.set(`/requests/${didUtils.didString(did)}`, request)
    if (!incoming) {
      await this.requestSend(did)
    }
    if (request.user && status === 'accepted') {
      await this.add(request.user)
    }
    await this.set(`/requests`, this.state.requests)

    return request
  }

  async requestSend(id: IridiumPeerIdentifier) {
    if (!this.iridium.connector) {
      logger.error('iridium/friends', 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const request = await this.getRequest(id)
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      logger.error('iridium/friends', 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const payload = {
      to: id,
      ...request,
      user: {
        did: this.iridium.connector.id,
        name: profile.name,
        photoHash: profile.photoHash,
      },
    }
    logger.info('iridium/friends', 'sending friend request', {
      id,
      payload,
    })
    return this.send(payload)
  }

  async requestSetUserData(id: IridiumPeerIdentifier, user: User) {
    const request = await this.getRequest(id)
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    request.user = user
    return this.requestSave(id, request, true)
  }

  async requestReject(did: IridiumPeerIdentifier, incoming = false) {
    const request = await this.getRequest(did)
    if (!request || request.status !== 'pending') {
      logger.error('iridium/friends', 'request not found')
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    logger.info('iridium/friends', 'request accepted', {
      did,
    })

    request.status = 'rejected'
    return this.requestSave(did, request, incoming)
  }

  /**
   * @method requestAccept
   * @description accept a friend request
   * @param did - IridiumPeerIdentifier (required)
   * @param incoming - boolean (default=false)
   * @returns Promise<FriendRequest>
   */
  async requestAccept(did: IridiumPeerIdentifier, incoming = false) {
    const request = await this.getRequest(did)
    if (!request || request.status !== 'pending') {
      logger.error('iridium/friends', 'request not found')
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    logger.info('iridium/friends', 'request accepted', {
      did,
    })

    request.status = 'accepted'
    return this.requestSave(did, request, incoming)
  }

  /**
   * @method add
   * @description add friend to state and create a conversation
   * @param user object (required)
   */
  async add(user: User) {
    if (!this.iridium.connector) {
      logger.error('iridium/friends', 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }

    if (this.getFriend(user.did)?.name === user.name) {
      logger.error('iridium/friends', 'already a friend', { user })
      throw new Error(`already friends with ${user.did}`)
    }

    this.state.details[user.did] = user
    const pid = user.peerId || (await didUtils.DIDToPeerId(user.did))
    await this.iridium.connector.p2p.addPeer({ did: user.did, type: 'peer' })
    await this.set(`/details/${user.did}`, user)
 if (!user.name) return
    const id = await encoding.hash([user.did, this.iridium.connector?.id].sort())
    if (id && !this.iridium.chat.hasConversation(id)) {
      return this.iridium.chat.createConversation({
        id,
        name: user.name,
        type: 'direct',
        participants: [user.did, this.iridium.connector.id],
      })
    }
  }

  /**
   * @method removeFriend
   * @description emit remove friend event, then clear local state
   * @param remotePeerDID id (required)
   */
  async removeFriend(remotePeerDID: string) {
    if (!this.iridium.connector) {
      logger.error('iridium/friends', 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      logger.error('iridium/friends', 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const payload: IridiumFriendEvent = {
      to: remotePeerDID,
      status: 'removed',
      at: Date.now(),
      user: {
        did: this.iridium.connector.id,
      },
    }
    logger.info('iridium/friends', 'removing friend', {
      remotePeerDID,
    })
    await this.send(payload)
    this.removeUserFromState(remotePeerDID)
  }

  /**
   * @method removeUserFromState
   * @description remove friend from the local state
   * @param remotePeerDID id (required)
   */
  async removeUserFromState(remotePeerDID: string) {
    const friend = this.getFriend(remotePeerDID)
    if (!friend) {
      logger.error('iridium/friends', 'friend not found', { remotePeerDID })
      throw new Error(FriendsError.FRIEND_NOT_FOUND)
    }

    const friendIndex = this.list.findIndex((f) => f.did === remotePeerDID)
    this.list.splice(friendIndex, 1)

    await this.set('/list', this.list)
  }
}
