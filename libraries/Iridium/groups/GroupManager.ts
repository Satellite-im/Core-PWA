import { Emitter, encoding } from '@satellite-im/iridium'
import type { IridiumMessage } from '@satellite-im/iridium/src/types'
import { IridiumManager } from '../IridiumManager'
import Group from './Group'
import { GroupConfig, GroupsError } from './types'

export default class GroupManager extends Emitter<IridiumMessage> {
  groupIds?: string[]
  state: { [key: string]: Group } = {}

  constructor(private readonly iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize groups, no iridium connector')
    }

    await this.fetch()
  }

  private async fetch() {
    this.state = await this.iridium.connector?.get('/groups')
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
      participants: Object.values(config.members).map((m) => m.id),
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
    return group
  }

  async getGroupMembers(groupId: string) {
    const group = await this.getGroup(groupId)
    return group.members
  }
}
