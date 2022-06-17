import { Emitter } from '@satellite-im/iridium/src/emitter'
import type { IridiumPeerMessage } from '@satellite-im/iridium/src/types'
import { IridiumManager } from '../IridiumManager'
import { Friend, FriendRequest, User } from './types'
import logger from '~/plugins/local/logger'

export type IridiumFriendEvent = {
  action: string
  user: User
  data?: any
  at: number
}

export type IridiumFriendPubsub = IridiumPeerMessage<IridiumFriendEvent>

export default class FriendsManager extends Emitter<IridiumFriendPubsub> {
  public readonly iridium: IridiumManager
  public state: {
    list?: { [key: string]: Friend }
    requests?: { [key: string]: FriendRequest }
  } = {}

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    logger.log('iridium/friends', 'initializing')
    await this.fetch()
    logger.log('iridium/friends', 'friends state loaded', this.state)
    await this.iridium.connector?.subscribe(
      `/friends/${this.iridium.connector?.id}`,
      this.onFriendActivity.bind(this),
    )
    logger.log('iridium/friends', 'listening for friend activity', this.state)
  }

  async stop() {
    await this.iridium.connector?.unsubscribe(
      `/friends/${this.iridium.connector?.id}`,
    )
  }

  async fetch() {
    this.state = await this.iridium.connector?.get('/friends')
  }

  async getRequests(): Promise<{ [key: string]: FriendRequest }> {
    return this.state.requests || {}
  }

  private async onFriendActivity(
    message: IridiumPeerMessage<IridiumFriendEvent>,
  ) {
    const { action, user, at, data } = message.payload
    if (action === 'request') {
      if (!['pending', 'accepted', 'rejected'].includes(data)) {
        return
      }
      await this.updateFriendRequest(user, data, true)
    }

    return this.emit(action, { user, data, at, action })
  }

  get(path: string, options: any = {}) {
    return this.iridium.connector?.get(`/friends/${path}`)
  }

  set(path: string, payload: any, options: any = {}) {
    return this.iridium.connector?.set(`/friends/${path}`, payload)
  }

  hasFriend(id: string) {
    return !!this.state.list?.[id]
  }

  getFriend(id: string) {
    return this.state.list?.[id]
  }

  hasRequest(id: string) {
    return !!this.state.requests?.[id]
  }

  getRequest(id: string) {
    return this.get(`/requests/${id}`)
  }

  send(friendId: string, event: IridiumFriendEvent) {
    return this.iridium.connector?.broadcast(`/friends/${friendId}`, event)
  }

  broadcast(event: IridiumFriendEvent) {
    return this.iridium.connector?.broadcast(
      `/friends/${this.iridium.connector?.id}`,
      event,
    )
  }

  async updateFriendRequest(
    friend: Friend,
    status = 'pending',
    incoming: boolean = false,
  ) {
    await this.set(`/requests/${friend.id}`, {
      ...friend,
      status,
      incoming,
      at: Date.now(),
    })
    const action =
      status === 'pending'
        ? 'request'
        : status === 'accepted'
        ? 'accept'
        : undefined
    if (!action) return
    const profile = await this.iridium.profile?.get('/')
    return this.send(friend.id, {
      action,
      user: {
        id: profile.id,
        name: profile.name,
        photoHash: profile.photoHash,
      },
      at: Date.now(),
    })
  }

  async createFriendRequest(user: User, status = 'pending') {
    if (this.hasFriend(user.id)) {
      throw new Error(`already have friend ${user.id}`)
    }

    if (this.hasRequest(user.id)) {
      throw new Error(`already have request for ${user.id}`)
    }

    return this.updateFriendRequest(user, status)
  }

  async acceptFriendRequest(friendId: string) {
    const request = await this.getRequest(friendId)
    if (!request) {
      throw new Error('friend request not found')
    }

    if (this.hasFriend(friendId)) {
      throw new Error('friend already exists')
    }

    await this.updateFriendRequest(request.user, 'accepted', true)
  }

  async rejectFriendRequest(friendId: string) {
    const request = await this.getRequest(friendId)
    if (!request) {
      throw new Error('friend request not found')
    }

    await this.set(`/requests/${friendId}`, {
      ...request.user,
      status: 'rejected',
      at: Date.now(),
    })
  }
}
