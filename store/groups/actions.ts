import Vue from 'vue'
import { dispatch } from 'jest-circus/build/state'
import { DataStateType } from '../dataState/types'
import { Group, GroupsError, GroupsState } from './types'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import GroupchatsProgram from '~/libraries/Solana/GroupchatsProgram/GroupchatsProgram'
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

    console.log('groupId')

    // generate random groupPassword
    // use pubKey of current user to encrypt groupId
    // create group in solana using encrypted groupId
    await groupChatProgram.create(groupId, name)

    console.time('start')
    await new Promise((resolve) => setTimeout(resolve, 20000))
    console.timeEnd('start')

    const group = await groupChatProgram.getGroupById(groupId)

    commit('addGroup', group)

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
   * @description invites user into group chat
   * @param group {Group} target group
   * @param recipient {string} recipient address
   * @example
   */
  async subscribeToGroupInvites(
    { commit, state, dispatch }: ActionsArguments<GroupsState>,
    { group, recipient }: { group: Group; recipient: string },
  ) {
    // TODO or unsubscribe if subscribed?
    if (state.subscriptionId === null) {
      const { publicKey } = getUserAccount()
      const groupProgram = getGroupChatProgram()

      const callback = (payload: InvitationAccount) => {
        dispatch('addGroup', payload.account.groupId)
      }

      groupProgram.subscribe(GroupEvents.NEW_INVITATION, callback, {
        recipient: publicKey.toBase58(),
      })
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
}
