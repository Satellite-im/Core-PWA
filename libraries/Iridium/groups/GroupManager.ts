import Vue from 'vue'
import {
  didUtils,
  Emitter,
  encoding,
  IridiumGetOptions,
  IridiumPeerIdentifier,
} from '@satellite-im/iridium'
import type { IridiumMessage } from '@satellite-im/iridium/src/types'
import { IridiumManager } from '../IridiumManager'
import Group from './Group'
import {
  GroupConfig,
  GroupManagerEvent,
  GroupMemberDetails,
  GroupsError,
} from './types'
import logger from '~/plugins/local/logger'

export type IridiumGroupEvent = {
  to: IridiumPeerIdentifier
  status: GroupManagerEvent
  at: number
  group: Group
  member?: GroupMemberDetails
  data?: any
}

export default class GroupManager extends Emitter<IridiumMessage> {
  groupIds?: string[]
  state: { [key: string]: Group } = {}

  private loggerTag = 'iridium/groups'

  constructor(private readonly iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize groups, no iridium connector')
    }

    iridium.pubsub.on('/groups/announce', this.onGroupsAnnounce.bind(this))

    await this.fetch()
  }

  private async fetch() {
    this.state = (await this.iridium.connector?.get('/groups')) || {}
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
      throw new Error(GroupsError.NETWORK_ERROR)
    }
    return this.iridium.connector?.get<T>(
      `/groups${path === '/' ? '' : path}`,
      options,
    )
  }

  private async onGroupsAnnounce(message: IridiumMessage<IridiumGroupEvent>) {
    const { from, payload } = message
    const { to, at, status, member, group } = payload.body

    if (to !== this.iridium.connector?.id) return
    const request = await this.getGroupAnnouncement(from).catch(() => undefined)
    switch (status) {
      case 'group-member-left':
        if (!request) {
          logger.warn(
            this.loggerTag,
            'ignoring group-member-left for unknown group',
          )
          return
        }
        await this.removeMemberFromGroup(
          group.id,
          (member as GroupMemberDetails).id,
        )
        break
    }

    return this.state
  }

  getGroupAnnouncement(did: IridiumPeerIdentifier): Promise<IridiumGroupEvent> {
    return this.get<IridiumGroupEvent>(`/announce/${didUtils.didString(did)}`)
  }

  /**
   * @method createGroup
   * attempt to create conversation with the provided config. if successful, create a new group too
   * @returns a string UUID of the created groupChat
   */
  async createGroup(config: Omit<GroupConfig, 'origin'>): Promise<string> {
    if (!this.iridium.connector) {
      return ''
    }
    const id = await encoding.hash({
      timestamp: Date.now(),
      origin: this.iridium.connector?.id,
    })

    await this.iridium.chat.createConversation({
      id,
      name: config.name,
      type: 'group',
      participants: Object.values(config.members),
    })
    await this.iridium.connector.set(`/groups/${id}`, {
      id,
      origin: this.iridium.connector.id,
      ...config,
    })
    return id
  }

  async getGroup(groupId: string) {
    if (this.state[groupId]) {
      return this.state[groupId]
    }

    const group = new Group(groupId, this.iridium)
    if (!group) {
      throw new Error(GroupsError.GROUP_NOT_FOUND)
    }
    await group.load()
    return group
  }

  async getGroupMembers(groupId: string) {
    const group = await this.getGroup(groupId)
    return group.members
  }

  async send(event: IridiumGroupEvent) {
    return this.iridium.connector?.publish(`/groups/announce`, event, {
      encrypt: {
        recipients: [typeof event.to === 'string' ? event.to : event.to.id],
      },
    })
  }

  async leaveGroup(groupId: string) {
    const profile = await this.iridium.profile?.get()

    if (!this.iridium.connector || !profile) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(GroupsError.NETWORK_ERROR)
    }
    // unsubscribe from group chat
    const group = await this.getGroup(groupId)
    await this.iridium.chat.unsubscribeFromConversation(group.id)

    // announce to group members
    if (!group.members?.[this.iridium.connector.id]) {
      logger.error(this.loggerTag, 'not a member of group')
      throw new Error(GroupsError.NOT_A_MEMBER)
    }

    Vue.delete(group.members, this.iridium.connector.id)

    Object.values(group.members).forEach(async (member) => {
      const payload: IridiumGroupEvent = {
        to: member.id,
        status: 'group-member-left',
        at: Date.now(),
        group,
        member: {
          id: this.iridium.connector?.id as string,
          name: profile?.name,
          photoHash: profile?.photoHash,
        },
      }
      logger.info(this.loggerTag, 'announce group left', { groupId, payload })
      await this.send(payload)
    })

    // remove group from local state and iridium
    const conversations = this.iridium.chat.state.conversations
    Vue.delete(conversations, group.id)
    this.iridium.chat.set('/conversations', conversations)
    logger.info(this.loggerTag, 'group left', { groupId, group })
  }

  async removeMemberFromGroup(groupId: string, remotePeerDID: string) {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(GroupsError.NETWORK_ERROR)
    }

    const group = await this.getGroup(groupId)
    const members = group.members
    if (!members || !members[remotePeerDID]) {
      throw new Error(GroupsError.RECIPIENT_NOT_FOUND)
    }

    Vue.delete(members, remotePeerDID)
    await this.iridium.connector.set(`/groups/${groupId}`, {
      id: groupId,
      origin: this.iridium.connector.id,
      group,
    })
    logger.info(this.loggerTag, 'member removed from group', {
      groupId,
      memberDid: remotePeerDID,
      members,
    })
  }

  async addMemberToGroup(groupId: string, remotePeerDID: string) {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(GroupsError.NETWORK_ERROR)
    }

    const group = await this.getGroup(groupId)
    const members = group.members
    if (!members) {
      logger.error(this.loggerTag, 'members is undefined')
      throw new Error(GroupsError.CANNOT_ADD_MEMBER)
    }

    const member = this.iridium.friends.getFriend(remotePeerDID)
    if (!member) {
      logger.error(this.loggerTag, 'friend not found')
      throw new Error(GroupsError.CANNOT_ADD_MEMBER)
    }

    const details: GroupMemberDetails = {
      id: remotePeerDID,
      name: member.name,
      photoHash: member.photoHash ?? '',
    }

    Vue.set(members, remotePeerDID, details)

    const conversation = this.iridium.chat.getConversation(groupId)
    conversation.participants.push(remotePeerDID)

    await this.iridium.connector.set(
      `/groups/${groupId}/members/${remotePeerDID}`,
      details,
    )

    logger.info(this.loggerTag, 'member added to group', {
      groupId,
      memberDid: remotePeerDID,
      members,
    })
  }
}
