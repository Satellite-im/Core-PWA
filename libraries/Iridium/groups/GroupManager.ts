import {
  didUtils,
  Emitter,
  encoding,
  IridiumGetOptions,
  IridiumPeerIdentifier,
  IridiumPubsubMessage,
} from '@satellite-im/iridium'
import type { IridiumMessage } from '@satellite-im/iridium/src/types'
import type { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import iridium from '../IridiumManager'
import {
  GroupConfig,
  GroupManagerEvent,
  GroupMemberDetails,
  GroupsError,
} from './types'
import logger from '~/plugins/local/logger'

export type GroupState = GroupConfig & {
  id: string
  origin: string
}

export type IridiumGroupEvent = {
  to: IridiumPeerIdentifier
  status: GroupManagerEvent
  at: number
  group: GroupState
  member?: GroupMemberDetails
  data?: any
}

export default class GroupManager extends Emitter<IridiumMessage> {
  groupIds?: string[]
  state: { [key: string]: GroupState } = {}

  private loggerTag = 'iridium/groups'

  async init() {
    if (!iridium.connector) {
      throw new Error('cannot initialize groups, no iridium connector')
    }

    iridium.connector.pubsub.on(
      '/groups/announce',
      this.onGroupsAnnounce.bind(this),
    )

    await this.fetch()
  }

  private async fetch() {
    this.state = (await iridium.connector?.get('/groups')) || {}
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
      throw new Error(GroupsError.NETWORK_ERROR)
    }
    return iridium.connector?.get<T>(
      `/groups${path === '/' ? '' : path}`,
      options,
    )
  }

  private async onGroupsAnnounce(
    message: IridiumPubsubMessage<IridiumDecodedPayload<IridiumGroupEvent>>,
  ) {
    const { from, payload } = message
    const { to, at, status, member, group } = payload.body

    if (to !== iridium.id) return
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
    if (!iridium.connector) {
      return ''
    }
    const id = await encoding.hash({
      timestamp: Date.now(),
      origin: iridium.id,
    })

    await iridium.chat.createConversation({
      id,
      name: config.name,
      type: 'group',
      participants: Object.values(config.members).map((m) => m.id),
    })
    this.state = {
      ...this.state,
      [id]: {
        id,
        origin: iridium.id,
        ...config,
      },
    }
    await iridium.connector.set(`/groups/${id}`, {
      id,
      origin: iridium.id,
      ...config,
    })
    return id
  }

  async getGroup(groupId: string): Promise<GroupState> {
    if (this.state[groupId]) {
      return this.state[groupId]
    }

    return this.get(`/${groupId}`)
  }

  async getGroupMembers(groupId: string) {
    const group = await this.getGroup(groupId)
    return group.members
  }

  async send(event: IridiumGroupEvent) {
    return iridium.connector?.publish(`/groups/announce`, event, {
      encrypt: {
        recipients: [typeof event.to === 'string' ? event.to : event.to.id],
      },
    })
  }

  async leaveGroup(groupId: string) {
    const profile = await iridium.profile?.get()

    if (!iridium.connector || !profile) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(GroupsError.NETWORK_ERROR)
    }
    // unsubscribe from group chat
    const group = await this.getGroup(groupId)
    await iridium.chat.unsubscribeFromConversation(group.id)

    // announce to group members
    if (!group.members?.[iridium.id]) {
      logger.error(this.loggerTag, 'not a member of group')
      throw new Error(GroupsError.NOT_A_MEMBER)
    }

    delete group.members[iridium.id]

    Object.values(group.members).forEach(async (member: GroupMemberDetails) => {
      const payload: IridiumGroupEvent = {
        to: member.id,
        status: 'group-member-left',
        at: Date.now(),
        group,
        member: {
          id: iridium.id as string,
          name: profile?.name,
          photoHash: profile?.photoHash,
        },
      }
      logger.info(this.loggerTag, 'announce group left', { groupId, payload })
      await this.send(payload)
    })

    // remove group from local state and iridium
    iridium.chat.deleteConversation(group.id)
    logger.info(this.loggerTag, 'group left', { groupId, group })
  }

  async removeMemberFromGroup(groupId: string, remotePeerDID: string) {
    if (!iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(GroupsError.NETWORK_ERROR)
    }

    const group = await this.getGroup(groupId)
    const members = group.members
    if (!members || !members[remotePeerDID]) {
      throw new Error(GroupsError.RECIPIENT_NOT_FOUND)
    }

    delete members[remotePeerDID]
    await iridium.connector.set(`/groups/${groupId}`, {
      id: groupId,
      origin: iridium.id,
      group,
    })
    logger.info(this.loggerTag, 'member removed from group', {
      groupId,
      memberDid: remotePeerDID,
      members,
    })
  }

  async addMemberToGroup(groupId: string, remotePeerDID: string) {
    if (!iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(GroupsError.NETWORK_ERROR)
    }

    const group = await this.getGroup(groupId)
    const members = group.members
    if (!members) {
      logger.error(this.loggerTag, 'members is undefined')
      throw new Error(GroupsError.CANNOT_ADD_MEMBER)
    }

    const member = iridium.users.getUser(remotePeerDID)
    if (!member) {
      logger.error(this.loggerTag, 'friend not found')
      throw new Error(GroupsError.CANNOT_ADD_MEMBER)
    }

    const details: GroupMemberDetails = {
      id: remotePeerDID,
      name: member.name,
      photoHash: member.photoHash?.toString() || '',
    }

    members[remotePeerDID] = details

    const conversation = iridium.chat.getConversation(groupId)
    conversation?.participants.push(remotePeerDID)

    await iridium.connector.set(
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
