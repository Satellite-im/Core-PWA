import Vue from 'vue'
import {
  IridiumPeerIdentifier,
  Emitter,
  didUtils,
  encoding,
  IridiumPubsubMessage,
} from '@satellite-im/iridium'
import type {
  IridiumMessage,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import type { IridiumManager } from '../IridiumManager'
import { User } from '../users/types'
import { FriendRequest, FriendRequestStatus, FriendsError } from './types'
import logger from '~/plugins/local/logger'
import {
  Notification,
  NotificationType,
} from '~/libraries/Iridium/notifications/types'

export type IridiumFriendEvent = {
  to: IridiumPeerIdentifier
  status: FriendRequestStatus
  user: User
  data?: any
  at: number
}
export type FriendState = {
  friends: string[]
  requests: { [key: string]: FriendRequest }
  blocked: string[]
}

export type IridiumFriendPubsub = IridiumPubsubMessage<
  IridiumDecodedPayload<IridiumFriendEvent>
>

export default class FriendsManager extends Emitter<IridiumFriendPubsub> {
  public readonly iridium: IridiumManager
  public state: FriendState = {
    friends: [],
    requests: {},
    blocked: [],
  }

  private loggerTag = 'iridium/friends'

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    if (!this.iridium.connector) {
      throw new Error('cannot initialize friends, no iridium connector')
    }

    const iridium = this.iridium.connector
    logger.log(this.loggerTag, 'initializing')
    const pubsub = iridium.pubsub.subscriptions()
    logger.info(this.loggerTag, 'pubsub', pubsub)
    await this.fetch()
    logger.log(this.loggerTag, 'friends state loaded', this.state)

    logger.info(this.loggerTag, 'subscribing to announce topic')
    await iridium.subscribe<IridiumFriendPubsub>('/friends/announce', {
      handler: this.onFriendsAnnounce.bind(this),
      sync: { offline: true },
    })
    // connect to all friends
    logger.info(this.loggerTag, 'connecting to friends', {
      friends: this.state.friends,
    })
    await Promise.all(
      this.state.friends.map(async (friendDid) => {
        if (!iridium.p2p.hasPeer(friendDid)) {
          logger.info(
            this.loggerTag,
            'registering friend as peer with iridium:',
            { friendDid },
          )
          await iridium.p2p.addPeer({ did: friendDid, type: 'peer' })
        }
        if (!this.iridium.users.hasUser(friendDid)) {
          await this.iridium.users.searchPeer(friendDid)
        }
      }),
    )

    logger.info(
      this.loggerTag,
      'connecting to requested friends',
      this.state.requests,
    )

    await Promise.all(
      Object.values(this.state.requests)
        .filter((request) => request.incoming)
        .map(async (request) => {
          if (!iridium.p2p.hasPeer(request.user.did)) {
            logger.info(
              this.loggerTag,
              'registering requested friend as peer with iridium',
              request,
            )
            await iridium.p2p.addPeer({ did: request.user.did, type: 'peer' })
          }
          if (!this.iridium.users.hasUser(request.user.did)) {
            await this.iridium.users.searchPeer(request.user.did)
          }
        }),
    )

    logger.info(this.loggerTag, 'initialized', this)
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
    const fetched = (await this.get('/')) || { friends: [], requests: {} }
    this.state.requests = fetched?.requests || {}
    this.state.friends = !fetched.friends
      ? []
      : Array.isArray(fetched.friends)
      ? fetched.friends
      : Object.values(fetched.friends)
    this.state.blocked = fetched.blocked || []
    logger.info(this.loggerTag, 'fetched', this.state)
    return this.state
  }

  private async onFriendsAnnounce(message: IridiumFriendPubsub) {
    const { from, payload } = message
    const { to, status } = payload.body
    if (from === this.iridium.connector?.id) {
      return
    }
    if (to !== this.iridium.connector?.id) return
    // if (Date.now() - at > 1000 * 60 * 60) {
    //   logger.warn(this.loggerPrefix, 'ignoring old friend activity')
    //   return
    // }

    const request = await this.getRequest(from).catch(() => undefined)
    await this.iridium.users.searchPeer(payload.body.user.did)
    const user =
      this.iridium.users.getUser(payload.body.user.did) || payload.body.user
    if (!request && status === 'pending') {
      await this.requestCreate(from, true, user)
    } else if (request && status === 'accepted') {
      await this.requestAccept(from)
    } else if (request && status === 'rejected') {
      await this.requestReject(from)
    } else if (status === 'removed') {
      await this.friendRemove(from)
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
   * @param did string (required)
   * @returns boolean
   */
  isFriend(did: IridiumPeerIdentifier) {
    return this.state.friends.includes(didUtils.didString(did))
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

  /**
   * @method requestCreate
   * @description create a friend request and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @param incoming - boolean (default=false)
   * @returns Promise<void>
   */
  async requestCreate(
    id: IridiumPeerIdentifier,
    incoming = false,
    user: User = {
      name: 'TODOfoo',
      did: didUtils.didString(id),
    },
  ): Promise<void> {
    const did = didUtils.didString(id)
    if (this.isFriend(did)) {
      logger.error(this.loggerTag, 'already a friend', { did })
      throw new Error(FriendsError.FRIEND_EXISTS)
    }
    if (this.hasRequest(did)) {
      logger.error(this.loggerTag, 'request already exists')
      return
    }

    if (!this.iridium.connector?.p2p.hasPeer(did)) {
      logger.info(this.loggerTag, 'adding peer for friend request', { did })
      await this.iridium.connector?.p2p.addPeer({
        did,
        type: 'peer',
      })
    }
    if (!this.iridium.connector?.p2p.getPeer(did)?.connected) {
      await this.iridium.connector?.p2p.connect(did)
    }

    const request: FriendRequest = {
      user: user || { did, name: did },
      status: 'pending',
      incoming,
      at: Date.now(),
    }

    this.state.requests = {
      ...this.state.requests,
      [did]: request,
    }
    await this.set(`/requests/${did}`, request)
    logger.info(this.loggerTag, 'friend request created', {
      did,
      request,
    })
    logger.info('iridium/friends', 'saving friend request', {
      did,
      request,
    })

    // Announce to the remote user
    if (did !== this.iridium.connector?.id) {
      const profile = this.iridium.profile.state
      if (!profile) {
        logger.error(this.loggerTag, 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }
      const payload: IridiumFriendEvent = {
        to: did,
        ...request,
        user: {
          did: profile.did,
          name: profile.name,
          photoHash: profile.photoHash,
        },
      }
      logger.info(this.loggerTag, 'announce request create', {
        did,
        payload,
      })

      const user = this.iridium.users.getUser(did)

      if (!user) return
      const buildNotification: Exclude<Notification, 'id'> = {
        fromName: user.name,
        at: request.at,
        title: 'New Request',
        description: `New ${NotificationType.FRIEND_REQUEST} From ${user.name}`,
        image: user.photoHash?.toString() || '',
        type: NotificationType.FRIEND_REQUEST,
        seen: false,
      }
      this.iridium.notifications.sendNotification(buildNotification)
      await this.send(payload)
    }
  }

  /**
   * @method requestReject
   * @description reject or cancel a friend request and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @returns Promise<void>
   */
  async requestReject(did: IridiumPeerIdentifier): Promise<void> {
    const request = await this.getRequest(did)
    if (!request) {
      logger.error(this.loggerTag, 'request not found')
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    const id = didUtils.didString(did)
    this.state.requests = Object.keys(this.state.requests)
      .filter((key) => key !== id)
      .reduce((acc, key: string) => {
        acc[key] = this.state.requests[key]
        return acc
      }, {} as { [key: string]: FriendRequest })
    await this.set(`/requests`, this.state.requests)
    logger.info(this.loggerTag, 'request rejected', {
      did,
      request,
    })

    // Announce to the remote user
    if (didUtils.didString(did) !== this.iridium.connector?.id) {
      const profile = await this.iridium.profile?.get()
      if (!profile) {
        logger.error(this.loggerTag, 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }
      request.status = 'rejected'
      const payload: IridiumFriendEvent = {
        to: did,
        ...request,
        user: {
          did: profile.did,
          name: profile.name,
          photoHash: profile.photoHash,
        },
      }

      logger.info(this.loggerTag, 'announce request reject', { did, payload })
      await this.send(payload)
    }
  }

  /**
   * @method requestAccept
   * @description accept a friend request and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @returns Promise<void>
   */
  async requestAccept(id: IridiumPeerIdentifier): Promise<void> {
    const did = didUtils.didString(id)
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const request = await this.getRequest(did)
    if (!request || request.status !== 'pending') {
      logger.error(this.loggerTag, 'request not found')
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }
    if (this.isFriend(did)) {
      logger.error(this.loggerTag, 'already a friend', { did })
      throw new Error(`already friends with ${did}`)
    }

    if (!this.iridium.connector?.p2p.hasPeer(did)) {
      logger.info(this.loggerTag, 'adding peer for friend request', {
        did,
      })
      await this.iridium.connector?.p2p.addPeer({
        did,
        type: 'peer',
      })
    }
    const peer = this.iridium.connector?.p2p.getPeer(did)
    if (!peer.connected) {
      await this.iridium.connector?.p2p.connect(did)
    }

    const user = this.iridium.users.getUser(did)
    if (!user) {
      throw new Error(`can't find user: ${did}`)
    }
    const participants = [did, this.iridium.connector.id]
    if (!(await this.iridium.chat.hasDirectConversation(did))) {
      await this.iridium.chat.createConversation({
        name: user.name,
        type: 'direct',
        participants,
      })
    }

    request.status = 'accepted'
    delete this.state.requests[did]
    this.state.friends = [...this.state.friends, did]
    this.state.requests = Object.keys(this.state.requests)
      .filter((key) => key !== did)
      .reduce((acc, key: string) => {
        acc[key] = this.state.requests[key]
        return acc
      }, {} as { [key: string]: FriendRequest })
    await this.set(`/friends`, this.state.friends)
    await this.set(`/requests`, this.state.requests)

    logger.info(this.loggerTag, 'request accepted', { did, request })

    // Announce to the remote user
    if (didUtils.didString(did) !== this.iridium.connector?.id) {
      const profile = this.iridium.profile.state
      if (!profile) {
        logger.error(this.loggerTag, 'network error')
        throw new Error(FriendsError.NETWORK_ERROR)
      }
      const payload: IridiumFriendEvent = {
        to: did,
        ...request,
        user: {
          did: profile.did,
          name: profile.name,
          photoHash: profile.photoHash,
        },
      }
      logger.info(this.loggerTag, 'announce request accepted', {
        did,
        payload,
      })
      await this.send(payload)
    }
  }

  /**
   * @method friendRemove
   * @description remove a friend and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @returns Promise<void>
   */
  async friendRemove(pid: IridiumPeerIdentifier): Promise<void> {
    const did = didUtils.didString(pid)
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const profile = this.iridium.profile.state
    if (!profile) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }

    if (!this.isFriend(pid)) {
      logger.error(this.loggerTag, 'friend not found', {
        did,
        friends: this.state.friends,
      })
      return
    }

    this.state.friends = this.state.friends.filter((id) => id !== did)
    await this.set(`/friends`, this.state.friends)
    const id = this.iridium.chat.directConversationIdFromDid(did)
    if (id) {
      this.iridium.chat.deleteConversation(id)
    }
    logger.info(this.loggerTag, 'friend removed', { did })

    // Announce to the remote user
    if (did !== this.iridium.connector?.id) {
      const payload: IridiumFriendEvent = {
        to: did,
        status: 'removed',
        at: Date.now(),
        user: {
          name: profile.name,
          did: profile.did,
        },
      }
      logger.info(this.loggerTag, 'announce remove friend', {
        did,
        payload,
      })
      await this.send(payload)
    }
  }
}
