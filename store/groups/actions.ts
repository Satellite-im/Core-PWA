import Vue from 'vue'
import { dispatch } from 'jest-circus/build/state'
import { DataStateType } from '../dataState/types'
import { Group, GroupsError, GroupsState } from './types'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import GroupchatsProgram from '~/libraries/Solana/GroupchatsProgram/GroupchatsProgram'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'
import {
  GroupEvents,
  InvitationAccount,
} from '~/libraries/Solana/GroupchatsProgram/GroupchatsProgram.types'

const getGroupChatManager = (): GroupChatManager => {
  const $TextileManager: TextileManager = Vue.prototype.$TextileManager

  if (!$TextileManager.groupChatManager?.isInitialized()) {
    throw new Error(GroupsError.TEXTILE_NOT_INITIALIZED)
  }
  return $TextileManager.groupChatManager
}

const getGroupChatProgram = (): GroupchatsProgram => {
  const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
  return new GroupchatsProgram($SolanaManager)
}

const getUsersProgram = (): UsersProgram => {
  const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
  return new UsersProgram($SolanaManager)
}

const getUserAccount = () => {
  const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
  const account = $SolanaManager.getActiveAccount() // TODO payer or user account?

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

    // generate random groupPassword
    // use pubKey of current user to encrypt groupId
    // create group in solana using encrypted groupId
    await groupChatProgram.create(groupId, name)
    const group = await groupChatProgram.waitForGroupReady(groupId)

    await commit('addGroup', group)

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

    const { publicKey } = getUserAccount() // TODO should we use payer account instead?
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
    // TODO or unsubscribe if subscribed?
    if (state.subscriptionId !== null) {
      await dispatch('unsubscribeFromGroupInvites')
    }
    const { publicKey } = getUserAccount()
    const groupProgram = getGroupChatProgram()

    const callback = async (payload: InvitationAccount) => {
      console.log('subscribeToGroupInvites:callback called', payload)
      const invite = await groupProgram.crypto.decryptInvite(payload.account)
      await dispatch('addGroup', invite.groupId)
    }

    const num = groupProgram.subscribe(GroupEvents.NEW_INVITATION, callback, {
      recipient: publicKey.toBase58(),
    })
    commit('setSubscriptionId', num)
    console.log('subscribeToGroupInvites DONE')
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
      console.log('unsubscribeFromGroupInvites DONE')
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

    commit('setGroupMembersInfo', { groupId, info })

    return info
  },
}
