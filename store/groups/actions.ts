import Vue from 'vue'
import { map, uniq } from 'lodash'
import { DataStateType } from '../dataState/types'
import { Group, GroupMember, GroupsError, GroupsState } from './types'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import BlockchainClient from '~/libraries/BlockchainClient'

const getGroupChatManager = (): GroupChatManager => {
  const $TextileManager: TextileManager = Vue.prototype.$TextileManager

  if (!$TextileManager.groupChatManager?.isInitialized()) {
    throw new Error(GroupsError.TEXTILE_NOT_INITIALIZED)
  }
  return $TextileManager.groupChatManager
}

const getUserAccount = () => {
  try {
    return BlockchainClient.getInstance().account
  } catch (e) {
    throw new Error(GroupsError.USER_NOT_INITIALIZED)
  }
}

export default {
  async initialize({ dispatch, state }: ActionsArguments<GroupsState>) {
    await Promise.all([
      dispatch('fetchGroups'),
      dispatch('subscribeToGroupInvites'),
      dispatch('subscribeToGroupsUpdate'),
    ])
    await Promise.all(
      state.all.map(async (group) => {
        await dispatch(
          'textile/subscribeToGroup',
          { groupId: group.id },
          { root: true },
        )
      }),
    )
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
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const groupChatManager = getGroupChatManager()

    const groupId = await groupChatManager.createGroupConversation()

    await $BlockchainClient.createGroup(groupId, name)

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

    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const { address } = getUserAccount()

    const groups = await $BlockchainClient.getUserGroups(address)
    const groupsUsers = await $BlockchainClient.getGroupsUsers(
      map(groups, 'id'),
    )

    const addresses = uniq([].concat(...(<any>map(groupsUsers, 'users'))))
    const usersInfo = await $BlockchainClient.getUsersInfo(addresses)

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
    { dispatch }: ActionsArguments<GroupsState>,
    { group, recipient }: { group: Group; recipient: string },
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    await $BlockchainClient.inviteToGroup(group.id, recipient)

    dispatch(
      'textile/sendGroupMessage',
      {
        groupId: group.id,
        message: `\`I added ${recipient} to the chat\``,
      },
      { root: true },
    )
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

    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const id = $BlockchainClient.addGroupInviteListener((payload) => {
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
      const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
      await $BlockchainClient.unsubscribeGroupInvite(state.inviteSubscription)
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
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const ids = await $BlockchainClient.addGroupsListener((payload) => {
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
    await dispatch('textile/subscribeToGroup', { groupId }, { root: true })
    if (!state.groupSubscriptions.includes(groupId)) {
      const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
      const id = await $BlockchainClient.addGroupListener(
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
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    if (state.groupSubscriptions.length) {
      await $BlockchainClient.removeGroupListeners(state.groupSubscriptions)
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
      const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
      const group = await $BlockchainClient.getGroupById(groupId)

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
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const addresses = await $BlockchainClient.getGroupUsers(groupId)
    const members = await $BlockchainClient.getUsersInfo(addresses)
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
  getUserAccount,
}
