import Vue from 'vue'
import { map, uniq } from 'lodash'
import { DataStateType } from '../dataState/types'
import { Group, GroupMember, GroupsError, GroupsState } from './types'
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
  async initialize({ dispatch }: ActionsArguments<GroupsState>) {
    await Promise.all([
      dispatch('fetchGroups'),
      dispatch('subscribeToGroupInvites'),
      dispatch('subscribeToGroupsUpdate'),
    ])
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
  async fetchGroups({ commit, dispatch }: ActionsArguments<GroupsState>) {
    commit(
      'dataState/setDataState',
      { key: 'groups', value: DataStateType.Loading },
      { root: true },
    )

    const { publicKey } = getUserAccount()
    const usersProgram = getUsersProgram()
    const groupChatProgram = getGroupChatProgram()

    const groups = await groupChatProgram.getUserGroups(publicKey)
    const groupsUsers = await groupChatProgram.getGroupsUsers(map(groups, 'id'))

    const addresses = uniq([].concat(...(<any>map(groupsUsers, 'users'))))
    const usersInfo = await usersProgram.getUsersInfo(addresses)

    const payload = groups.map((group) => {
      const members = groupsUsers
        .find((it) => it.id === group.id)
        ?.users?.map((address) =>
          usersInfo.find((user) => user.address === address),
        )
        .filter(Boolean) as GroupMember[]

      return { ...group, members: members || [] }
    })
    commit('setGroups', payload)
    await dispatch('fetchGroupsLastUpdate')
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

    const id = getGroupChatProgram().addInviteListener((payload) => {
      commit('addGroup', { ...payload, members: [] })
      dispatch('fetchGroupMembers', payload.id)
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
    const ids = await getGroupChatProgram().addGroupsListener((payload) => {
      commit('updateGroup', payload)
      dispatch('fetchGroupMembers', payload.id)
    })

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
        (payload) => {
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
   * @method fetchGroupMembers
   * @description fetch groups members by given group id
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

  /**
   * @method fetchGroupsLastUpdate
   * @description fetch groups last message time
   * @example
   */
  async fetchGroupsLastUpdate({
    commit,
    state,
  }: ActionsArguments<GroupsState>) {
    const groupChatManager = getGroupChatManager()

    const ids = map(state.all, 'id')
    const results = await Promise.all(
      ids.map((id) => groupChatManager.getGroupLastUpdate(id)),
    )
    const payload = ids.reduce(
      (prev, curr, i) => ({ ...prev, [curr]: results[i] }),
      {},
    )
    commit('setGroupsLastUpdate', payload)
  },
}

export const exportForTesting = {
  getGroupChatManager,
  getGroupChatProgram,
  getUsersProgram,
  getUserAccount,
}
