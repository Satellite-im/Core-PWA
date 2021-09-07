import Vue from 'vue'
import { Commit } from 'vuex'
import { DataStateType } from '../dataState/state'
import { CreateFriendRequestArguments, FriendsError } from './types'
import { Friends } from '~/mock/friends'

import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import FriendsProgram from '~/libraries/Solana/FriendsProgram/FriendsProgram'
import { FriendStatus } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'

// const textileMailboxId =
//   'bafkwqw5h6zlko43enhmrrlksx3fhitmojzpnwtagbrjcflm737btxbq'

// const paddedBuffer = Buffer.from(textileMailboxId.padStart(64, '0'))

interface FetchFriendsArguments {
  commit: Commit
  state: any
}
export default {
  handler: () => {},
  async fetchFriends({ commit, state }: FetchFriendsArguments) {
    if (
      state.dataState.friends === DataStateType.Loading ||
      state.dataState.friends === DataStateType.Updating
    ) {
      return
    }
    if (state.dataState.friends === DataStateType.Empty) {
      commit('setDataState', { key: 'friends', value: DataStateType.Loading })
    } else {
      commit('setDataState', { key: 'friends', value: DataStateType.Updating })
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('fetchFriends', Friends)
    commit('setDataState', { key: 'friends', value: DataStateType.Ready })
  },
  async createFriendRequest(
    { commit, state }: FetchFriendsArguments,
    { friendToKey, textileMailboxId }: CreateFriendRequestArguments
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error('Payer account not found')
    }

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      throw new Error('User account not found')
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const friendAccountKey = await friendsProgram.computeFriendAccountKey(
      userAccount.publicKey,
      friendToKey
    )

    let friendAccountInfo = await friendsProgram.getFriend(friendAccountKey)

    const friendAccountMirroredKey =
      await friendsProgram.computeFriendAccountKey(
        friendToKey,
        userAccount.publicKey
      )

    let friendAccountMirroredInfo = await friendsProgram.getFriend(
      friendAccountMirroredKey
    )

    if (!friendAccountInfo) {
      friendAccountInfo = await friendsProgram.createFriend(
        userAccount.publicKey,
        friendToKey
      )
    }

    if (!friendAccountMirroredInfo) {
      friendAccountMirroredInfo = await friendsProgram.createFriend(
        friendToKey,
        userAccount.publicKey
      )
    }

    if (
      friendAccountInfo.status === FriendStatus.PENDING ||
      friendAccountMirroredInfo.status === FriendStatus.PENDING
    ) {
      throw new Error(FriendsError.REQUEST_ALREADY_SENT)
    }

    if (
      friendAccountInfo.status === FriendStatus.ACCEPTED ||
      friendAccountMirroredInfo.status === FriendStatus.ACCEPTED
    ) {
      throw new Error(FriendsError.REQUEST_ALREADY_ACCEPTED)
    }

    const friendRequest = await friendsProgram.createFriendRequest(
      friendAccountKey,
      friendAccountMirroredKey,
      userAccount,
      friendToKey,
      Buffer.from(textileMailboxId.padStart(64, '0')),
      Buffer.from(''.padStart(64, '0'))
    )
  },
  async getFriendRequests({ commit, state }: FetchFriendsArguments) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const requests = await friendsProgram.getFriendRequests(
      FriendStatus.PENDING
    )

    console.log('requests', requests)
  },
}
