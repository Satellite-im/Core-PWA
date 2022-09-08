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
import iridium from '../IridiumManager'
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
  public state: FriendState = {
    friends: [],
    requests: {},
    blocked: [],
  }

  private loggerTag = 'iridium/friends'

  async init() {
    if (!iridium.connector) {
      throw new Error('cannot initialize friends, no iridium connector')
    }

    logger.log(this.loggerTag, 'initializing')
    const pubsub = iridium.connector.pubsub.subscriptions()
    logger.info(this.loggerTag, 'pubsub', pubsub)
    await this.fetch()
    logger.log(this.loggerTag, 'friends state loaded', this.state)

    logger.info(this.loggerTag, 'subscribing to announce topic')
    await iridium.connector.subscribe<IridiumFriendPubsub>(
      '/friends/announce',
      {
        handler: this.onFriendsAnnounce.bind(this),
        sync: { offline: true },
      },
    )
    // connect to all friends
    logger.info(this.loggerTag, 'connecting to friends', {
      friends: this.state.friends,
    })
    await Promise.all(
      this.state.friends.map(async (friendDid) => {
        await iridium.users.searchPeer(friendDid)
        if (!iridium.connector) return
        if (!iridium.connector.p2p.hasPeer(friendDid)) {
          logger.info(
            this.loggerTag,
            'registering friend as peer with iridium:',
            { friendDid },
          )
          await iridium.connector.p2p.addPeer({ did: friendDid, type: 'peer' })
        }
        if (!iridium.users.hasUser(friendDid)) {
          await iridium.users.searchPeer(friendDid)
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
          if (!iridium.connector) return
          if (!iridium.connector.p2p.hasPeer(request.user.did)) {
            logger.info(
              this.loggerTag,
              'registering requested friend as peer with iridium',
              request,
            )
            await iridium.connector.p2p.addPeer({
              did: request.user.did,
              type: 'peer',
            })
          }
          if (!iridium.users.hasUser(request.user.did)) {
            await iridium.users.searchPeer(request.user.did)
          }
        }),
    )

    logger.info(this.loggerTag, 'initialized', this)
    this.emit('ready', {})
  }

  async stop() {
    await iridium.connector?.pubsub.unsubscribe(`/friends/announce`)
  }

  /**
   * @method fetch
   * @description fetch remote state
   * @returns updated state
   */
  async fetch() {
    const fetched = ((await this.get('/')) as FriendState) || {
      friends: [],
      requests: {},
    }
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
    if (from === iridium.id) {
      return
    }
    if (to !== iridium.id) return
    // if (Date.now() - at > 1000 * 60 * 60) {
    //   logger.warn(this.loggerPrefix, 'ignoring old friend activity')
    //   return
    // }

    const request = await this.getRequest(from).catch(() => undefined)
    let user = iridium.users.getUser(payload.body.user.did) || payload.body.user
    if (!user) {
      ;[user] = await iridium.users.searchPeer(payload.body.user.did)
    }
    if (!request && status === 'pending') {
      await this.requestCreate(user, true)
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
    if (!iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    return iridium.connector?.get<T>(
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

    return iridium.connector?.set(
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
    return iridium.connector?.publish(`/friends/announce`, event, {
      encrypt: {
        recipients: [
          typeof event.to === 'string' ? event.to : event.to.id,
          iridium.id,
        ],
      },
    })
  }

  broadcast(event: IridiumFriendEvent) {
    return iridium.connector?.publish(`/friends/announce`, event)
  }

  /**
   * @method requestCreate
   * @description create a friend request and announce it to the remote user
   * @param user IridiumUser (required)
   * @param incoming boolean (required)
   * @returns Promise<void>
   */
  async requestCreate(user: User, incoming: boolean): Promise<void> {
    const did = didUtils.didString(user.did)
    if (this.isFriend(did)) {
      logger.error(this.loggerTag, 'already a friend', { did })
      throw new Error(FriendsError.FRIEND_EXISTS)
    }
    if (this.hasRequest(did)) {
      logger.error(this.loggerTag, 'request already exists')
      return
    }

    if (!iridium.connector?.p2p.hasPeer(did)) {
      logger.info(this.loggerTag, 'adding peer for friend request', { did })
      await iridium.connector?.p2p.addPeer({
        did,
        type: 'peer',
      })
    }
    if (!iridium.connector?.p2p.getPeer(did)?.connected) {
      await iridium.connector?.p2p.connect(did)
    }

    const request: FriendRequest = {
      user,
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
    if (did !== iridium.id) {
      const profile = iridium.profile.state
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

      iridium.users.setUser(did, user)

      const buildNotification: Exclude<Notification, 'id'> = {
        fromName: user.name,
        at: request.at,
        title: 'New Request',
        description: `New ${NotificationType.FRIEND_REQUEST} From ${user.name}`,
        image: user.photoHash?.toString() || '',
        type: NotificationType.FRIEND_REQUEST,
        seen: false,
      }
      iridium.notifications.sendNotification(buildNotification)
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
    if (didUtils.didString(did) !== iridium.id) {
      const profile = await iridium.profile?.get()
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
    if (!iridium.connector) {
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

    if (!iridium.connector?.p2p.hasPeer(did)) {
      logger.info(this.loggerTag, 'adding peer for friend request', {
        did,
      })
      await iridium.connector?.p2p.addPeer({
        did,
        type: 'peer',
      })
    }
    const peer = iridium.connector?.p2p.getPeer(did)
    if (!peer.connected) {
      await iridium.connector?.p2p.connect(did)
    }

    const user = iridium.users.getUser(did)
    if (!user) {
      throw new Error(`can't find user: ${did}`)
    }
    const participants = [did, iridium.id]
    if (!(await iridium.chat.hasDirectConversation(did))) {
      await iridium.chat.createConversation({
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
    if (didUtils.didString(did) !== iridium.id) {
      const profile = iridium.profile.state
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
    if (!iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(FriendsError.NETWORK_ERROR)
    }
    const profile = iridium.profile.state
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
    const id = iridium.chat.directConversationIdFromDid(did)
    if (id) {
      iridium.chat.deleteConversation(id)
    }
    logger.info(this.loggerTag, 'friend removed', { did })

    // Announce to the remote user
    if (did !== iridium.id) {
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
