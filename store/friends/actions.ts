import { PublicKey } from '@solana/web3.js'
import { keys } from 'libp2p-crypto'
// import { createFromPubKey } from 'peer-id'
import Vue from 'vue'
import { uniqBy, find } from 'lodash'
import {
  FriendRequestArguments,
  friendAccountToIncomingRequest,
  friendAccountToOutgoingRequest,
  FriendsState,
} from './types'
import { DataStateType } from '~/store/dataState/types'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import { AccountsError } from '~/store/accounts/types'
import { ActionsArguments } from '~/types/store/store'
import { Friend, OutgoingRequest } from '~/types/ui/friends'
import BlockchainClient from '~/libraries/BlockchainClient'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'

export default {
  // async initialize({ dispatch, commit }: ActionsArguments<FriendsState>) {
  //   commit(
  //     'dataState/setDataState',
  //     { key: 'friends', value: DataStateType.Loading },
  //     { root: true },
  //   )
  //   await Promise.all([
  //     dispatch('fetchFriends', {}),
  //     dispatch('fetchFriendRequests', {}),
  //     dispatch('subscribeToFriendsEvents', {}),
  //   ])
  //   commit(
  //     'dataState/setDataState',
  //     { key: 'friends', value: DataStateType.Ready },
  //     { root: true },
  //   )
  // },
  // /**
  //  * @method fetchFriendRequests DocsTODO
  //  * @description
  //  * @param
  //  * @example
  //  */
  // async fetchFriendRequests({ commit }: ActionsArguments<FriendsState>) {
  //   await iridium.friends?.fetch()
  //   const requests = await iridium.friends?.getRequests()
  //   if (!requests) return
  //   const incomingRequests: any[] = []
  //   const outgoingRequests: any[] = []
  //   Object.entries(requests).forEach(([_key, request]) => {
  //     // const req = {
  //     //   did: request.user.did,
  //     //   from: request.user.did,
  //     //   pending: true,
  //     //   requestId: request.user.did,
  //     //   userInfo: {
  //     //     username: request.user.name,
  //     //     status: request.user.status,
  //     //     photoHash: request.user.photoHash,
  //     //     address: request.user.did,
  //     //   },
  //     // }
  //     if (request.incoming) {
  //       incomingRequests.push(request)
  //     } else {
  //       outgoingRequests.push(request)
  //     }
  //   })
  //   commit('setIncomingRequests', uniqBy(incomingRequests, 'requestId'))
  //   commit('setOutgoingRequests', uniqBy(outgoingRequests, 'requestId'))
  // },
  // /**
  //  * @method fetchFriends DocsTODO
  //  * @description
  //  * @param
  //  * @example
  //  */
  // async fetchFriends({ dispatch, commit }: ActionsArguments<FriendsState>) {
  //   commit(
  //     'dataState/setDataState',
  //     { key: 'friends', value: DataStateType.Loading },
  //     { root: true },
  //   )
  //   await iridium.friends?.fetch()
  //   const friends = await iridium.friends?.getFriends()
  //   if (!friends) return
  //   Object.entries(friends).forEach(([_key, friend]) => {
  //     commit('addFriend', {
  //       did: friend.did,
  //       name: friend.name,
  //       profilePicture: friend.photoHash,
  //       status: friend.status,
  //       pending: false,
  //       address: friend.did,
  //       state: 'offline',
  //       unreadCount: 0,
  //       peerId: friend.peerId,
  //     })
  //   })
  //   commit(
  //     'dataState/setDataState',
  //     { key: 'friends', value: DataStateType.Ready },
  //     { root: true },
  //   )
  // },
  // /**
  //  * @method subscribeToFriendsEvents DocsTODO
  //  * @description
  //  * @param
  //  * @example
  //  */
  // subscribeToFriendsEvents({
  //   dispatch,
  //   commit,
  //   rootState,
  // }: ActionsArguments<FriendsState>) {
  //   iridium.friends?.on('request/changed', () => {
  //     dispatch('fetchFriendRequests')
  //   })
  //   logger.log('FRIENDS', 'Subscribed to friend activity', iridium.friends)
  // },
  // setFriendState(
  //   { commit }: ActionsArguments<FriendsState>,
  //   { address, state }: { address: string; state: string },
  // ) {
  //   commit('friends/updateFriend', { address, state }, { root: true })
  // },
  // /**
  //  * @method createFriendRequest DocsTODO
  //  * @description
  //  * @param friendToKey
  //  * @param textileMailboxId
  //  * @example
  //  */
  // async createFriendRequest(
  //   { commit }: ActionsArguments<FriendsState>,
  //   { did }: FriendRequestArguments,
  // ) {
  //   await iridium.friends?.createFriendRequest(did)
  // },
  // /**
  //  * @method acceptFriendRequest
  //  * @description Accept a friend request
  //  * @param friendRequest The friend request to accept
  //  * @param textileMailboxId  The textile mailbox id of the user accepting the request
  //  * @example
  //  */
  // async acceptFriendRequest(
  //   { commit, dispatch }: ActionsArguments<FriendsState>,
  //   { did }: FriendRequestArguments,
  // ) {
  //   await iridium.friends?.acceptFriendRequest(did)
  // },
  // /**
  //  * @method denyFriendRequest
  //  * @description Deny a friend request
  //  * @param friendRequest The friend request to deny
  //  * @example
  //  */
  // async denyFriendRequest(
  //   { commit }: ActionsArguments<FriendsState>,
  //   { did }: FriendRequestArguments,
  // ) {
  //   await iridium.friends?.rejectFriendRequest(did)
  // },
  // /**
  //  * @method removeFriendRequest
  //  * @description Remove a friend request
  //  * @param friendRequest The friend request to remove
  //  * @example
  //  */
  // async removeFriendRequest(
  //   { commit }: ActionsArguments<FriendsState>,
  //   { did }: FriendRequestArguments,
  // ) {
  //   await iridium.friends?.rejectFriendRequest(did)
  // },
  // /**
  //  * @method removeFriend
  //  * @description Remove a friend
  //  * @param friend  The friend to remove
  //  * @example
  //  */
  // async removeFriend(
  //   { commit, dispatch, rootState }: ActionsArguments<FriendsState>,
  //   { did }: FriendRequestArguments,
  // ) {
  //   await iridium.friends?.removeFriend(did)
  // },
}

export const exportForTesting = {
  friendAccountToIncomingRequest,
  friendAccountToOutgoingRequest,
}
