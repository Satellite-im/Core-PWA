import Vue from 'vue'
import {
  IridiumPeerIdentifier,
  Emitter,
  didUtils,
  IridiumPubsubMessage,
} from '@satellite-im/iridium'
import type {
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import iridium from '../IridiumManager'
import { User } from '../users/types'
import { FriendRequest, FriendRequestStatus, FriendsError } from './types'
import logger from '~/plugins/local/logger'
import {
  FriendRequestNotificationPayload,
  NotificationBase,
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
  requests: { [key: string]: FriendRequest | undefined }
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

  async start() {
    if (!iridium.connector) {
      throw new Error('cannot initialize friends, no iridium connector')
    }

    logger.log(this.loggerTag, 'initializing')
    const pubsub = iridium.connector.pubsub.subscriptions()
    logger.info(this.loggerTag, 'pubsub', pubsub)
    await this.fetch()
    logger.log(this.loggerTag, 'friends state loaded', this.state)

    if (iridium.connector.p2p.hasNode) {
      await this.startP2P()
    }

    iridium.connector.p2p.on('nodeReady', async () => {
      await this.startP2P()
    })

    logger.info(this.loggerTag, 'initialized', this)
    this.emit('ready', {})
  }

  async startP2P() {
    // connect to all friends
    await Promise.all(
      [
        async () => {
          logger.info(this.loggerTag, 'subscribing to announce topic')

          await iridium.connector?.subscribe<IridiumFriendPubsub>(
            '/friends/announce',
            {
              handler: this.onFriendsAnnounce.bind(this),
              sync: { offline: true },
            },
          )
        },
        async () => {
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
                await iridium.connector.p2p.addPeer({
                  did: friendDid,
                  type: 'peer',
                })
              }
              if (!iridium.users.hasUser(friendDid)) {
                await iridium.users.searchPeer(friendDid)
              }
            }),
          )
        },
        async () => {
          logger.info(this.loggerTag, 'connecting to friends', {
            friends: this.state.friends,
          })
          // todo add type guard #4809
          await Promise.all(
            Object.values(this.state.requests)
              .filter((request) => request?.incoming)
              .map(async (request) => {
                if (!iridium.connector || !request?.did) return
                if (!iridium.connector.p2p.hasPeer(request.did)) {
                  logger.info(
                    this.loggerTag,
                    'registering requested friend as peer with iridium',
                    request,
                  )
                  await iridium.connector.p2p.addPeer({
                    did: request.did,
                    type: 'peer',
                  })
                }
                if (!iridium.users.hasUser(request.did)) {
                  await iridium.users.searchPeer(request.did)
                }
              }),
          )
        },
      ].map((fn) => fn()),
    )
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
    logger.info(this.loggerTag, 'friends announce', {
      to,
      from,
      status,
      payload,
    })
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
    if (!user?.did) {
      ;[user] = await iridium.users.searchPeer(payload.body.user.did)
    }
    if (!user?.did) return
    if (!request && status === 'pending') {
      await this.requestCreate(user, true)
    } else if (request && status === 'accepted') {
      await this.requestAccept(from, true)
    } else if (request && status === 'rejected') {
      await this.requestReject(from, true)
    } else if (status === 'removed') {
      await this.friendRemove(from, true)
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
      this.state.requests?.[str]?.status !== 'rejected'
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

  /**
   * @method requestCreate
   * @description create a friend request and announce it to the remote user
   * @param user IridiumUser (required)
   * @param incoming boolean (required)
   * @returns Promise<void>
   */
  async requestCreate(user: User, incoming: boolean = false): Promise<void> {
    const did = didUtils.didString(user.did)
    if (this.isFriend(did)) {
      logger.error(this.loggerTag, 'already a friend', { did })
      throw new Error(FriendsError.FRIEND_EXISTS)
    }
    if (this.hasRequest(did)) {
      logger.error(this.loggerTag, 'request already exists')
      throw new Error(FriendsError.REQUEST_ALREADY_SENT)
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
      did: user.did,
      status: 'pending',
      incoming,
      at: Date.now(),
    }

    await iridium.users.setUser(did, user)

    Vue.set(this.state.requests, did, request)
    await this.set(`/requests/${did}`, request)
    logger.info(this.loggerTag, 'friend request created', {
      did,
      incoming,
      request,
    })
    logger.info('iridium/friends', 'saving friend request', {
      did,
      request,
    })

    // Announce to the remote user
    if (!incoming) {
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

      await this.send(payload)
    } else {
      this.sendNotification(user)
    }
  }

  private sendNotification(user: User) {
    const notification: NotificationBase<FriendRequestNotificationPayload> = {
      at: Date.now(),
      seen: false,
      type: NotificationType.FRIEND_REQUEST,
      senderId: user.did,
      payload: {
        senderId: user.did,
      },
      image: user.photoHash as string,
    }
    iridium.notifications.emit('notification/create', notification)
  }

  /**
   * @method requestReject
   * @description reject or cancel a friend request and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @returns Promise<void>
   */
  async requestReject(
    did: IridiumPeerIdentifier,
    incoming: boolean = false,
  ): Promise<void> {
    const request = await this.getRequest(did)
    if (!request) {
      logger.error(this.loggerTag, 'request not found')
      throw new Error(FriendsError.REQUEST_NOT_FOUND)
    }

    Vue.delete(this.state.requests, didUtils.didString(did))
    await this.set(`/requests`, this.state.requests)
    if (!iridium.chat.isUserInOtherGroups(didUtils.didString(did))) {
      // do not set incoming to 'incoming' since the user will be removed on the other side by the requestReject event
      iridium.users.userRemove(did, true)
    }
    logger.info(this.loggerTag, 'request rejected', {
      did,
      request,
      incoming,
    })

    // Announce to the remote user
    if (!incoming) {
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
  async requestAccept(
    id: IridiumPeerIdentifier,
    incoming: boolean = false,
  ): Promise<void> {
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

    request.status = 'accepted'
    this.state.friends.push(did)
    Vue.delete(this.state.requests, did)

    const participants = [did, iridium.id]
    if (!(await iridium.chat.hasDirectConversation(did))) {
      await iridium.chat.createConversation({
        name: user.name,
        type: 'direct',
        participants,
      })
    }

    await this.set(`/friends`, this.state.friends)
    await this.set(`/requests`, this.state.requests)

    logger.info(this.loggerTag, 'request accepted', { did, request, incoming })

    // Announce to the remote user
    if (!incoming) {
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
  async friendRemove(
    pid: IridiumPeerIdentifier,
    incoming: boolean = false,
  ): Promise<void> {
    this.emit(
      'routeCheck',
      iridium.chat.directConversationIdFromDid(didUtils.didString(pid)),
    )
    // TODO: update when group calls are implemented
    if (iridium.webRTC.state.activeCall?.did === pid) {
      await iridium.webRTC.hangUp()
    }

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
    if (!iridium.chat.isUserInOtherGroups(did)) {
      // do not set incoming to 'incoming' since the user will be removed on the other side by the friendRemove event
      iridium.users.userRemove(did, true)
    }
    const id = iridium.chat.directConversationIdFromDid(did)
    if (id) {
      iridium.chat.deleteConversation(id)
    }
    logger.info(this.loggerTag, 'friend removed', { did, incoming })

    // Announce to the remote user
    if (!incoming) {
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
