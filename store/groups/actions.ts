import Vue from 'vue'
import { DataStateType } from '../dataState/types'
import { Group, GroupsError, GroupsState } from './types'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import GroupChatsProgram from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'

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
  initialize({ dispatch }: ActionsArguments<GroupsState>) {
    dispatch('fetchGroups')
    dispatch('subscribeToGroupInvites')
    dispatch('subscribeToGroupsUpdate')
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
    {}: ActionsArguments<GroupsState>,
    { group, recipient }: { group: Group; recipient: string },
  ) {
    const groupProgram = getGroupChatProgram()
    await groupProgram.invite(group.id, recipient)
  },

  /**
   * @method subscribeToGroupInvites
   * @description subscribe to group chat invites
   * @example
   */
  async subscribeToGroupInvites({
    state,
    dispatch,
    commit,
  }: ActionsArguments<GroupsState>) {
    if (state.inviteSubscription !== null) {
      await dispatch('unsubscribeFromGroupInvites')
    }

    const id = getGroupChatProgram().addInviteListener((payload: Group) => {
      commit('addGroup', payload)
      dispatch('subscribeToGroupUpdate', payload.id)
    })

    commit('setInviteSubscription', id)
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
    if (state.inviteSubscription) {
      await getGroupChatProgram().unsubscribe(state.inviteSubscription)
      commit('setInviteSubscription', null)
    }
  },

  /**
   * @method subscribeToGroupsUpdate
   * @description subscribe to multiple groups update
   * @example
   */
  async subscribeToGroupsUpdate({
    state,
    dispatch,
    commit,
  }: ActionsArguments<GroupsState>) {
    if (state.groupSubscriptions.length) {
      await dispatch('unsubscribeFromGroupsUpdate')
    }
    const ids = await getGroupChatProgram().addGroupsListener(
      (payload: Group) => {
        commit('updateGroup', payload)
        dispatch('fetchGroupMembers', payload.id)
      },
    )

    commit('setGroupSubscriptions', ids)
  },

  /**
   * @method subscribeToGroupUpdate
   * @description subscribe to group update
   * @example
   */
  async subscribeToGroupUpdate(
    { state, dispatch, commit }: ActionsArguments<GroupsState>,
    groupId: string,
  ) {
    if (!state.groupSubscriptions.includes(groupId)) {
      const id = await getGroupChatProgram().addGroupListener(
        groupId,
        (payload: Group) => {
          commit('updateGroup', payload)
          dispatch('fetchGroupMembers', payload.id)
        },
      )
      commit('addGroupSubscription', id)
    }
  },

  /**
   * @method unsubscribeFromGroupsUpdate
   * @description remove all groups update invites listener
   * @example
   */
  async unsubscribeFromGroupsUpdate({
    state,
    commit,
  }: ActionsArguments<GroupsState>) {
    if (state.groupSubscriptions.length) {
      await getGroupChatProgram().removeGroupListeners(state.groupSubscriptions)
      commit('setGroupSubscriptions', [])
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
    groupId: string,
  ) {
    const groupChatProgram = getGroupChatProgram()
    const usersProgram = getUsersProgram()

    const addresses = await groupChatProgram.getGroupUsers(groupId)
    const members = await usersProgram.getUsersInfo(addresses)
    commit('setGroupMembers', { groupId, members })
  },
}
