import { Iridium, Emitter } from '@satellite-im/iridium/dist/index.browser'
import type { IridiumMessage } from '@satellite-im/iridium/src/types'
import * as json from 'multiformats/codecs/json'
import { IridiumManager } from '../IridiumManager'
import Group from './Group'
import { GroupConfig, GroupData, GroupsError } from './types'
import logger from '~/plugins/local/logger'

export default class GroupManager extends Emitter<IridiumMessage> {
  groupIds?: string[]
  state: { [key: string]: Group } = {}

  constructor(private readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    logger.log('iridium/groups', 'init()')
    this.state = await this.iridium.connector?.get('/groups')
  }

  /**
   * @method createGroupConversation
   * Create a conversation with specific users
   * @returns a string UUID of the created groupChat
   */
  async createGroup(config: GroupConfig): Promise<string> {
    const id = await Iridium.hash(
      json.encode({
        timestamp: Date.now(),
        origin: this.iridium.connector?.id,
      }),
    )

    const group: GroupData = {
      id,
      ...config,
    }

    const exists = await this.iridium.connector?.get(`/groups/${id}`)
    if (exists) {
      throw new Error(GroupsError.GROUP_ALREADY_EXISTS)
    }

    await this.iridium.connector?.set(`/groups/${id}`, group)
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
