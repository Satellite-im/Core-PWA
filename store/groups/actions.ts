import Vue from 'vue'
import { DataStateType } from '../dataState/types'
import { Group, GroupsError, GroupsState } from './types'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import GroupChatsProgram from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'
import {
  GroupEvents,
  InvitationAccount,
} from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram.types'

const getGroupChatManager = (): GroupChatManager => {
  const $TextileManager: TextileManager = Vue.prototype.$TextileManager

  if (!$TextileManager.groupChatManager?.isInitialized()) {
    throw new Error(GroupsError.TEXTILE_NOT_INITIALIZED)
  }
  return $TextileManager.groupChatManager
}

const getGroupChatProgram = (): GroupChatsProgram => {
  const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
  return new GroupChatsProgram($SolanaManager)
}

const getUsersProgram = (): UsersProgram => {
  const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
  return new UsersProgram($SolanaManager)
}

const getUserAccount = () => {
  const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
  const account = $SolanaManager.getActiveAccount()

  if (!account) {
    throw new Error(GroupsError.USER_NOT_INITIALIZED)
  }

  return account
}

export default {
  /**
   * @method createGroup
   * @description create new group chat
   * @example
   */
  async createGroup(
    { commit }: ActionsArguments<GroupsState>,
    { name }: { name: string },
  ) {
    const groupChatProgram = getGroupChatProgram()
    const groupChatManager = getGroupChatManager()

    const groupId = await groupChatManager.createGroupConversation()

    await groupChatProgram.create(groupId, name)

    return groupId
  },

  /**
   * @method fetchGroups
   * @description fetch groups in which user participates
   * @example
   */
  async fetchGroups({ commit }: ActionsArguments<GroupsState>) {
    commit(
      'dataState/setDataState',
      { key: 'groups', value: DataStateType.Loading },
      { root: true },
    )

    const { publicKey } = getUserAccount()
    const groupChatProgram = getGroupChatProgram()
    getGroupChatManager()
    const groups = await groupChatProgram.getUserGroups(publicKey)

    commit('setGroups', groups)
    commit(
      'dataState/setDataState',
      { key: 'groups', value: DataStateType.Ready },
      { root: true },
    )
  },

  /**
   * @method sendGroupInvite
   * @description invites user into group chat
   * @param group {Group} target group
   * @param recipient {string} recipient address
   * @example
   */
  async sendGroupInvite(
    { commit, state, rootState, dispatch }: ActionsArguments<GroupsState>,
    { group, recipient }: { group: Group; recipient: string },
  ) {
    const groupProgram = getGroupChatProgram()
    await groupProgram.invite(group.id, recipient)

    commit('updateGroup', {
      id: group.id,
      members: group.members + 1,
    })
  },

  /**
   * @method sendGroupInvite
   * @description subscribe to group chat invites
   * @example
   */
  async subscribeToGroupInvites({
    state,
    dispatch,
    commit,
  }: ActionsArguments<GroupsState>) {
    if (state.subscriptionId !== null) {
      await dispatch('unsubscribeFromGroupInvites')
    }
    const { publicKey } = getUserAccount()
    const groupProgram = getGroupChatProgram()

    const callback = async (payload: InvitationAccount) => {
      const invite = await groupProgram.crypto.decryptInvite(payload.account)
      await dispatch('addGroup', invite.groupId)
    }

    const num = groupProgram.subscribe(GroupEvents.NEW_INVITATION, callback, {
      recipient: publicKey.toBase58(),
    })
    commit('setSubscriptionId', num)
  },

  /**
   * @method unsubscribeFromGroupInvites
   * @description remove group chat invites listener
   * @example
   */
  async unsubscribeFromGroupInvites({
    state,
    commit,
  }: ActionsArguments<GroupsState>) {
    if (state.subscriptionId) {
      const groupProgram = getGroupChatProgram()
      await groupProgram.unsubscribe(state.subscriptionId)
      commit('setSubscriptionId', null)
    }
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
      const groupProgram = getGroupChatProgram()
      const group = await groupProgram.getGroupById(groupId)

      commit('addGroup', group)
    }
  },

  /**
   * @method fetchGroups
   * @description fetch groups in which user participates
   * @example
   */
  async fetchGroupMembers(
    { commit }: ActionsArguments<GroupsState>,
    { groupId }: { groupId: string },
  ) {
    const groupChatProgram = getGroupChatProgram()
    const usersProgram = getUsersProgram()

    const addresses = await groupChatProgram.getGroupUsers(groupId)
    const info = await usersProgram.getUsersInfo(addresses)

    commit('setGroupMembersInfo', { groupId, info, addresses })

    return info
  },
}
