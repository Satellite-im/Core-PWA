import { Iridium, Emitter } from '@satellite-im/iridium'
import type {
  IridiumPeerMessage,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IridiumManager } from '../IridiumManager'
import { FriendRequest, FriendRequestStatus, FriendsError, User } from './types'
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
    list: User[]
    requests: FriendRequest[]
    error: string | null
  } = { list: [], requests: [], error: null }

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    if (!this.iridium.connector) {
      this.state.error = FriendsError.CONNECTOR_ERROR
      return this.state.error
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
      this.state.list.forEach(async (user) => {
        const peerId = await Iridium.DIDToPeerId(user.did)
        if (peerId && !iridium.hasPeer(peerId.toString())) {
          logger.info(
            'iridium/friends',
            'registering friendly peerId with iridium',
            {
              did: user.did,
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
    }
  }

  /**
   * @method fetch
   * @description fetch remote state
   * @returns updated state
   */
  async fetch() {
    const res = await this.get('/')
    if ('requests' in res) {
      this.state = { ...this.state, ...res }
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
    try {
      if (!this.iridium.connector) {
        logger.error('iridium/friends', 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }
      return this.iridium.connector?.get<T>(
        `/friends${path === '/' ? '' : path}`,
        options,
      )
    } catch (err) {
      this.setError(err)
    }
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
   * @method setError
   * @param err error object
   * @description set error to local state
   */
  setError(err: any) {
    err.name = ''
    this.state.error = err.toString()
  }

  /**
   * @method clearError
   * @description clear error from local state
   */
  clearError() {
    this.state.error = null
  }

  /**
   * @method getRequest
   * @description returns request from id
   * @param id string (required)
   * @returns request object if found in the local state
   */
  getRequest(id: string): FriendRequest | undefined {
    return this.state.requests.find((r) => r.user.did === id)
  }

  /**
   * @method isFriend
   * @description check on the local state if there's a friend with the current id
   * @param id string (required)
   * @returns boolean
   */
  isFriend(id: string) {
    return Boolean(this.getFriend(id))
  }

  /**
   * @method getFriend
   * @description check if there's a friend with the current id and returns friend data object
   * @param id string (required)
   * @returns friend data object if found in the local state
   */
  getFriend(id: string) {
    return this.state.list.find((f) => f.did === id)
  }

  private async onFriendActivity(
    message: IridiumPeerMessage<IridiumFriendEvent>,
  ) {
    const { from, payload, did } = message
    const { to, status, user } = payload

    if (to !== this.iridium.connector?.id) return
    const request = this.getRequest(did)
    this.clearError()
    if (!request && status === 'pending') {
      await this.requestInsert(did, true, user)
    } else if (status === 'removed') {
      await this.removeUserFromState(did)
    } else if (request) {
      request.status = status
      request.user = user
      await this.requestSave(did, request)
    }
  }

  /**
   * @method send
   * @description send broadcast event
   * @param event iridium type event (required)
   * @returns broadcast event
   */
  send(event: IridiumFriendEvent) {
    return this.iridium.connector?.broadcast(`/friends/announce`, event, {
      encrypt: {
        recipients: [event.to, this.iridium.connector?.id],
      },
    })
  }

  /**
   * @method requestInsert
   * @description parse a new request and add it to state
   * @param remotePeerDID string (required)
   * @param incoming boolean
   * @param user object
   * @returns request parsed object
   */
  async requestInsert(remotePeerDID: string, incoming = false, user: User) {
    try {
      if (!incoming && remotePeerDID === this.iridium.connector?.id) {
        logger.error('iridium/friends', 'self request')
        throw new Error(FriendsError.SELF_ADD)
      }
      if (this.isFriend(remotePeerDID)) {
        logger.error('iridium/friends', 'already a friend', { remotePeerDID })
        throw new Error(FriendsError.FRIEND_EXISTS)
      }
      if (this.getRequest(remotePeerDID)) {
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

      return this.requestSave(remotePeerDID, request)
    } catch (err) {
      this.setError(err)
    }
  }

  /**
   * @method requestSave
   * @description handle request state store, trigger broadcast event when request change
   * @param remotePeerDID string (required)
   * @param request request object (required)
   * @returns request parsed object
   */
  async requestSave(remotePeerDID: string, request: FriendRequest) {
    logger.info('iridium/friends', 'saving friend request', {
      remotePeerDID,
      request,
    })

    const { user, status, incoming } = request
    if (!(incoming && status === 'pending')) {
      await this.requestSendUpdate(request, status)
    }

    const stateReq = this.getRequest(remotePeerDID)
    if (stateReq) {
      const index = this.state.requests.indexOf(stateReq)
      this.state.requests.splice(index, 1)
    }

    if (status === 'pending') {
      this.state.requests.push(request)
    }
    if (user && status === 'accepted') {
      await this.add(user)
    }
    await this.set(`/requests`, this.state.requests)

    return request
  }

  /**
   * @method requestSendUpdate
   * @description updates request and send the broadcast event
   * @param request request object (required)
   * @param reqStatus status (required)
   * @returns broadcast event
   */
  async requestSendUpdate(
    request: FriendRequest,
    reqStatus: FriendRequestStatus,
  ) {
    try {
      if (!this.iridium.connector) {
        logger.error('iridium/friends', 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }
      const profile = await this.iridium.profile?.get()
      if (!profile) {
        logger.error('iridium/friends', 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }
      const payload = {
        to: request.user.did,
        ...request,
        status: reqStatus,
        user: {
          did: this.iridium.connector.id,
          peerId: this.iridium.connector.peerId,
          name: profile.name,
          photoHash: profile.photoHash,
        },
      }
      logger.info('iridium/friends', 'updating friend request', {
        remotePeerDID: request.user.did,
        payload,
      })
      return this.send(payload)
    } catch (err) {
      this.setError(err)
    }
  }

  /**
   * @method requestReject
   * @description reject a friend request
   * @param remotePeerDID id (required)
   * @returns request object
   */
  requestReject(remotePeerDID: string) {
    try {
      const request = this.getRequest(remotePeerDID)
      if (!request || request.status !== 'pending') {
        logger.error('iridium/friends', 'request not found')
        throw new Error(FriendsError.REQUEST_NOT_FOUND)
      }

      logger.info('iridium/friends', 'request accepted', {
        remotePeerDID,
      })

      request.status = 'rejected'
      return this.requestSave(remotePeerDID, request)
    } catch (err) {
      this.setError(err)
    }
  }

  /**
   * @method requestAccept
   * @description accept a friend request
   * @param remotePeerDID id (required)
   * @returns request object
   */
  requestAccept(remotePeerDID: string) {
    try {
      const request = this.getRequest(remotePeerDID)
      if (!request || request.status !== 'pending') {
        logger.error('iridium/friends', 'request not found')
        throw new Error(FriendsError.REQUEST_NOT_FOUND)
      }

      logger.info('iridium/friends', 'request accepted', {
        remotePeerDID,
      })

      request.status = 'accepted'
      return this.requestSave(remotePeerDID, request)
    } catch (err) {
      this.setError(err)
    }
  }

  /**
   * @method add
   * @description add friend to state and create a conversation
   * @param user object (required)
   */
  async add(user: User) {
    try {
      if (!this.iridium.connector) {
        logger.error('iridium/friends', 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }

      if (this.getFriend(user.did)?.name === user.name) {
        logger.error('iridium/friends', 'already a friend', { user })
        throw new Error(`already friends with ${user.did}`)
      }

      this.state.list.push(user)
      const pid = user.peerId || (await Iridium.DIDToPeerId(user.did))
      await this.iridium.connector.followPeer(pid.toString())
      await this.set('/list', this.state.list)
      if (!user.name) return
      const id = await this.iridium.chat?.directConversationId(user.did)
      if (id && !this.iridium.chat?.hasConversation(id)) {
        return this.iridium.chat?.createConversation({
          name: user.name,
          type: 'direct',
          participants: [user.did, this.iridium.connector.id],
        })
      }
    } catch (err) {
      this.setError(err)
    }
  }

  /**
   * @method removeFriend
   * @description emit remove friend event, then clear local state
   * @param remotePeerDID id (required)
   */
  async removeFriend(remotePeerDID: string) {
    try {
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
    } catch (err) {
      this.setError(err)
    }
  }

  /**
   * @method removeUserFromState
   * @description remove friend from the local state
   * @param remotePeerDID id (required)
   */
  async removeUserFromState(remotePeerDID: string) {
    try {
      const friend = this.getFriend(remotePeerDID)
      if (!friend) {
        logger.error('iridium/friends', 'friend not found', { remotePeerDID })
        throw new Error(FriendsError.FRIEND_NOT_FOUND)
      }

      const friendIndex = this.state.list.findIndex(
        (f) => f.did === remotePeerDID,
      )
      this.state.list.splice(friendIndex, 1)

      await this.set('/list', this.state.list)
    } catch (err) {
      this.setError(err)
    }
  }
}
