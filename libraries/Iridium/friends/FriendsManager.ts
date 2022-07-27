import Vue from 'vue'
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
export type FriendState = {
  details: { [key: string]: Friend }
  requests: { [key: string]: FriendRequest }
  blocked: string[]
}

export type IridiumFriendPubsub = IridiumMessage<IridiumFriendEvent>

export default class FriendsManager extends Emitter<IridiumFriendPubsub> {
  public readonly iridium: IridiumManager
  public state: FriendState = {
    details: {},
    requests: {},
    blocked: [],
  }

  private loggerTag = 'iridium/friends'

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
    logger.log(this.loggerTag, 'initializing')
    const pubsub = await iridium.pubsub.subscriptions()
    logger.info(this.loggerTag, 'pubsub', pubsub)
    await this.fetch()
    logger.log(this.loggerTag, 'friends state loaded', this.state)
    logger.info(this.loggerTag, 'subscribing to announce topic')
    await iridium.subscribe('/friends/announce')
    // console.info('waiting for topic peer')
    // await this.iridium.connector?.waitForTopicPeer(topic)
    iridium.pubsub.on('/friends/announce', this.onFriendsAnnounce.bind(this))
    logger.log(this.loggerTag, 'listening for friend activity', this.state)
    // connect to all friends
    if (this.list) {
      logger.info(this.loggerTag, 'connecting to friends', this.list)
      this.list.forEach(async (friend: User) => {
        if (friend && !iridium.p2p.hasPeer(friend.did)) {
          logger.info(
            this.loggerTag,
            'registering friendly peer with iridium',
            friend,
          )
          iridium.p2p.addPeer({ did: friend.did, type: 'peer' })
        }
      })
    }

    if (this.requestList.length) {
      logger.info(
        this.loggerTag,
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
    this.state = {
      ...this.state,
      ...(await this.get('/')),
    }
    return this.state
  }

  async getRequests(): Promise<{ [key: string]: FriendRequest }> {
    return this.state.requests || {}
  }

  async getFriends(): Promise<{ [key: string]: Friend }> {
    return this.state.details || {}
  }

  private async onFriendsAnnounce(message: IridiumMessage<IridiumFriendEvent>) {
    const { from, payload } = message
    const { to, at, status, user } = payload.body
    // if (Date.now() - at > 1000 * 60 * 60) {
    //   logger.warn(this.loggerPrefix, 'ignoring old friend activity')
    //   return
    // }

    if (to !== this.iridium.connector?.id) return
    const request = await this.getRequest(from).catch(() => undefined)
    if (!request && status === 'pending') {
      await this.requestCreate(from, true, user)
    } else if (request && status === 'rejected') {
      request.incoming = false
      request.status = status
      await this.requestDelete(from, request)
    } else if (request) {
      request.status = status
      await this.requestSave(from, request)
    }
    if (request && user && status === 'accepted') {
      Vue.set(this.state.details, user.did, user)
      await this.set(`/details/${from}`, user)
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
    logger.info(this.loggerTag, 'path, paylaod and state', {
      path,
      payload,
      state: this.state,
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
    return did ? this.state.details?.[didUtils.didString(did)] : undefined
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
      logger.error(this.loggerTag, 'already a friend', { did })
      throw new Error(FriendsError.FRIEND_EXISTS)
    }
    if (this.hasRequest(did)) {
      logger.error(this.loggerTag, 'request already exists')
      throw new Error(FriendsError.REQUEST_ALREADY_SENT)
    }
    logger.info(this.loggerTag, 'creating friend request', {
      did,
      incoming,
    })
    const request: FriendRequest = {
      user: user || { did, name: did },
      status: 'pending',
      incoming,
      at: Date.now(),
    }
    return this.requestSave(did, request)
  }

  async requestSave(did: IridiumPeerIdentifier, request: FriendRequest) {
    logger.info(this.loggerTag, 'saving friend request', {
      did,
      request,
    })
    await this.set(`/requests/${didUtils.didString(did)}`, request)
    Vue.set(this.state.requests, didUtils.didString(did), request)

    if (!request.incoming && request.status === 'pending') {
      await this.requestSend(did)
    }

    if (request.user && request.status === 'accepted') {
      await this.add(request.user)
    }

    return request
  }

  async requestSend(id: IridiumPeerIdentifier) {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const request = await this.getRequest(id)
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      logger.error(this.loggerTag, 'network error')
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
    logger.info(this.loggerTag, 'sending friend request', {
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
    return this.requestSave(id, request)
  }

  async requestReject(did: IridiumPeerIdentifier) {
    const request = await this.getRequest(did)
    if (!request || request.status !== 'pending') {
      logger.error(this.loggerTag, 'request not found')
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    logger.info(this.loggerTag, 'request rejected', {
      did,
    })

    request.status = 'rejected'
    return this.requestDelete(did, request)
  }

  async requestDelete(
    did: IridiumPeerIdentifier,
    request: FriendRequest,
  ): Promise<void> {
    logger.info(this.loggerTag, 'deleting friend request', {
      did,
      request,
    })
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    if (!request) {
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    await this.set(`/requests/${didUtils.didString(did)}`, request)
    Vue.set(this.state.requests, didUtils.didString(did), request)

    if (request.incoming) {
      const profile = await this.iridium.profile?.get()
      if (!profile) {
        logger.error(this.loggerTag, 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }
      const payload: IridiumFriendEvent = {
        to: did,
        ...request,
        user: {
          did: this.iridium.connector.id,
          name: profile.name,
          photoHash: profile.photoHash,
        },
      }
      logger.info(this.loggerTag, 'rejecting a friend request', {
        did,
        payload,
      })
      await this.send(payload)
    }
  }

  /**
   * @method requestAccept
   * @description accept a friend request
   * @param did - IridiumPeerIdentifier (required)
   * @param incoming - boolean (default=false)
   * @returns Promise<FriendRequest>
   */
  async requestAccept(did: IridiumPeerIdentifier) {
    const request = await this.getRequest(did)
    if (!request || request.status !== 'pending') {
      logger.error(this.loggerTag, 'request not found')
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    logger.info(this.loggerTag, 'request accepted', {
      did,
    })

    request.status = 'accepted'
    return this.requestSave(did, request)
  }

  /**
   * @method add
   * @description add friend to state and create a conversation
   * @param user object (required)
   */
  async add(user: User) {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    if (this.getFriend(user.did)?.name === user.name) {
      logger.error(this.loggerTag, 'already a friend', { user })
      throw new Error(`already friends with ${user.did}`)
    }

    const pid = user.peerId || (await didUtils.DIDToPeerId(user.did))
    await this.iridium.connector?.p2p?.addPeer({
      did: user.did,
      type: 'peer',
    })
    Vue.set(this.state.details, user.did, user)
    await this.set(`/details/${user.did}`, user)
    if (!user.name) return
    const id = await encoding.hash(
      [user.did, this.iridium.connector?.id].sort(),
    )
    if (id && !this.iridium.chat.hasConversation(id)) {
      await this.iridium.chat.createConversation({
        id,
        name: user.name,
        type: 'direct',
        participants: [user.did, this.iridium.connector.id],
      })
    }

    // TODO: needs updated ChatManager
    if (id && !this.iridium.chat.hasConversation(id)) {
      // return this.iridium.chat?.createConversation({
      //   name: user.name,
      //   type: 'direct',
      //   participants: [user.did, this.iridium.connector.id],
      // })
    }
    const request = await this.getRequest(user.did)

    if (request.incoming) {
      const profile = await this.iridium.profile?.get()
      const payload = {
        ...request,
        to: user.did,
        incoming: false,
        user: {
          did: this.iridium.connector.id,
          name: profile?.name,
          photoHash: profile?.photoHash,
        },
      }
      logger.info(this.loggerTag, 'sending acceptance of friend request', {
        did: user.did,
        payload,
      })
      return this.send(payload)
    }
  }

  /**
   * @method removeFriend
   * @description emit remove friend event, then clear local state
   * @param remotePeerDID id (required)
   */
  async removeFriend(remotePeerDID: string) {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const payload: IridiumFriendEvent = {
      to: remotePeerDID,
      status: 'removed',
      at: Date.now(),
      user: {
        name: profile.name,
        did: this.iridium.connector.id,
      },
    }
    logger.info(this.loggerTag, 'removing friend', {
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
      logger.error(this.loggerTag, 'friend not found', { remotePeerDID })
      throw new Error(FriendsError.FRIEND_NOT_FOUND)
    }

    Vue.set(this.state.details, remotePeerDID, null)
    await this.set('/details', this.state.details)
  }
}
