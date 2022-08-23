import { GroupsState } from './types'
import { ActionsArguments } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default {
  async initialize({ dispatch, state }: ActionsArguments<GroupsState>) {
    await iridium.groups?.init()
  },

  /**
   * @method createGroup
   * @description create new group chat
   * @example
   */
  async createGroup(
    { commit }: ActionsArguments<GroupsState>,
    { name }: { name: string },
  ) {
    return iridium.groups?.createGroup({
      name,
      origin: iridium.connector?.id,
      members: {},
    })
  },

  /**
   * @method addGroup
   * @description fetch group data and add it to group list
   * @param groupId {string} group id to add
   * @example
   */
  async addGroup(
    { commit, state }: ActionsArguments<GroupsState>,
    groupId: string,
  ) {
    if (!state.all.find((group) => group.id === groupId)) {
      const group = await iridium.groups?.getGroup(groupId)
      commit('addGroup', group)
    }
  },

  /**
   * @method fetchGroupMembers
   * @description fetch groups members by given group id
   * @example
   */
  async fetchGroupMembers(
    { commit }: ActionsArguments<GroupsState>,
    groupId: string,
  ) {
    const members = await iridium.groups?.getGroupMembers(groupId)
    commit('setGroupMembers', { groupId, members })
  },
}
