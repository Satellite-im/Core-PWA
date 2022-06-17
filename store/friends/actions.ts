import { PublicKey } from '@solana/web3.js'
import { keys } from 'libp2p-crypto'
import { createFromPubKey } from 'peer-id'
import Vue from 'vue'
import type { FriendsState } from './types'
import type {
  FriendRequest,
  Friend,
  User,
} from '~/libraries/Iridium/friends/types'
import { DataStateType } from '~/store/dataState/types'
import { TextileError } from '~/store/textile/types'
import Crypto from '~/libraries/Crypto/Crypto'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import {
  FriendAccount,
  FriendsEvents,
  FriendStatus,
} from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { MetadataManager } from '~/libraries/Textile/MetadataManager'
import TextileManager from '~/libraries/Textile/TextileManager'
import { AccountsError } from '~/store/accounts/types'
import { ActionsArguments } from '~/types/store/store'
import { FriendMetadata } from '~/types/textile/metadata'
import BlockchainClient from '~/libraries/BlockchainClient'
import iridium from '~/libraries/Iridium/IridiumManager'
import { FriendsGetters } from './getters'

export default {
  async initialize({ dispatch, commit }: ActionsArguments<FriendsState>) {
    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Loading },
      { root: true },
    )

    if (!iridium.friends) {
      throw new Error('Iridium not initialized')
    }

    await iridium.friends.init()

    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Ready },
      { root: true },
    )
  },

  /**
   * @method fetchFriendRequests DocsTODO
   * @description
   * @param
   * @example
   */
  async fetchFriendRequests({ commit }: ActionsArguments<FriendsState>) {
    const requests = Object.values(
      await iridium.friends?.get(`/requests`),
    ) as FriendRequest[]
    commit(
      'setRequests',
      requests.filter((r: FriendRequest) => r.incoming),
    )
  },

  /**
   * @method fetchFriends DocsTODO
   * @description
   * @param
   * @example
   */
  async fetchFriends({ dispatch, commit }: ActionsArguments<FriendsState>) {
    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Loading },
      { root: true },
    )

    const friends = (await iridium.friends?.get(`/friends`)) as {
      [key: string]: Friend
    }
    commit('setFriends', friends)

    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Ready },
      { root: true },
    )
  },

  /**
   * @method fetchFriendDetails DocsTODO
   * @description
   * @param friendAccount
   * @example
   */
  async fetchFriendDetails(
    { commit }: ActionsArguments<FriendsState>,
    friendId: string,
  ): Promise<void> {
    const friend = await iridium.friends?.getFriend(friendId)
    commit('updateFriend', friend)
  },

  /**
   * @description Update a metadata to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address and metadata
   */
  async updateFriendMetadata(
    { commit, rootState }: ActionsArguments<FriendsState>,
    { friendId, metadata }: { friendId: string; metadata: FriendMetadata },
  ) {
    if (!iridium.friends) return
    await iridium.friends?.set(`/friends/${friendId}/metadata`, metadata)
    const friend = await iridium.friends.getFriend(friendId)

    commit('updateFriend', friend)
    if (rootState.ui.userProfile) {
      const userProfile: Friend = rootState.ui.userProfile as Friend
      if (userProfile.id === friendId) {
        commit('ui/setUserProfile', friend, { root: true })
      }
    }
  },

  setFriendState(
    { commit }: ActionsArguments<FriendsState>,
    { address, state }: { address: string; state: string },
  ) {
    commit('friends/updateFriend', { address, state }, { root: true })
  },
  /**
   * @method createFriendRequest DocsTODO
   * @description
   * @param friendToKey
   * @param textileMailboxId
   * @example
   */
  async createFriendRequest(
    { commit }: ActionsArguments<FriendsState>,
    { friendToKey }: CreateFriendRequestArguments,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const $Crypto: Crypto = Vue.prototype.$Crypto
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    if (!textilePublicKey) {
      throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    }

    const { publicKey: friendFromKey } =
      await $BlockchainClient.getFriendsPayer()
    const accountKeys = await $BlockchainClient.computeAccountKeys(
      friendFromKey,
      friendToKey,
    )

    const accountStatus = await $BlockchainClient.getAccountStatus(
      accountKeys.request,
    )

    if (accountStatus === FriendStatus.PENDING) {
      throw new Error(FriendsError.REQUEST_ALREADY_SENT)
    }

    if (accountStatus === FriendStatus.ACCEPTED) {
      throw new Error(FriendsError.REQUEST_ALREADY_ACCEPTED)
    }

    // Initialize current recipient for encryption
    await $Crypto.initializeRecipient(friendToKey)

    // Encrypt textile mailbox id for the recipient
    const encryptedTextilePublicKey = await $Crypto.encryptFor(
      friendToKey.toBase58(),
      textilePublicKey,
    )

    await $BlockchainClient.makeFriendRequest(
      accountKeys.request,
      accountKeys.first,
      accountKeys.second,
      encryptedTextilePublicKey,
    )

    const friendAccountInfo = await $BlockchainClient.getFriendAccount(
      accountKeys.request,
    )

    if (friendAccountInfo) {
      const userInfo = await $BlockchainClient.getUserInfo(friendAccountInfo.to)
      commit(
        'addOutgoingRequest',
        friendAccountToOutgoingRequest(friendAccountInfo, userInfo),
      )
    }
  },

  /**
   * @method acceptFriendRequest
   * @description Accept a friend request
   * @param friendRequest The friend request to accept
   * @param textileMailboxId  The textile mailbox id of the user accepting the request
   * @example
   */
  async acceptFriendRequest(
    { commit, dispatch }: ActionsArguments<FriendsState>,
    { friendRequest }: AcceptFriendRequestArguments,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const $Crypto: Crypto = Vue.prototype.$Crypto
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    if (!textilePublicKey) {
      throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    }

    commit('updateIncomingRequest', { ...friendRequest, pending: true })
    const { account, requestId } = friendRequest

    const friendAccountKey = new PublicKey(requestId)

    const accountStatus = await $BlockchainClient.getAccountStatus(
      friendAccountKey,
    )

    switch (accountStatus) {
      case FriendStatus.PENDING: {
        // Initialize current recipient for encryption
        await $Crypto.initializeRecipient(new PublicKey(account.from))

        // Encrypt textile mailbox id for the recipient
        const encryptedTextilePublicKey = await $Crypto.encryptFor(
          account.from,
          textilePublicKey,
        )

        await $BlockchainClient.acceptFriendRequest(
          friendAccountKey,
          encryptedTextilePublicKey,
        )
        await dispatch('textile/subscribeToMailbox', {}, { root: true })
        // Request has been successfully accepted
        // fetch the friend details
        dispatch('fetchFriendDetails', account)

        break
      }
      case FriendStatus.ACCEPTED: {
        // Request was already accepted
        // fetch the friend details
        dispatch('fetchFriendDetails', account)

        break
      }
      default: {
        break
      }
    }
  },
  /**
   * @method denyFriendRequest
   * @description Deny a friend request
   * @param friendRequest The friend request to deny
   * @example
   */
  async denyFriendRequest(
    { commit }: ActionsArguments<FriendsState>,
    friendRequest: FriendRequest,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const payerAccount = await $BlockchainClient.payerAccount

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    commit('updateIncomingRequest', { ...friendRequest, pending: true })

    const { requestId } = friendRequest

    const friendAccountKey = new PublicKey(requestId)

    await $BlockchainClient.denyFriendRequest(friendAccountKey)

    commit('removeIncomingRequest', requestId)
  },

  /**
   * @method removeFriendRequest
   * @description Remove a friend request
   * @param friendRequest The friend request to remove
   * @example
   */
  async removeFriendRequest(
    { commit }: ActionsArguments<FriendsState>,
    friendRequest: OutgoingRequest,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const payerAccount = $BlockchainClient.payerAccount

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    commit('updateOutgoingRequest', { ...friendRequest, pending: true })

    const { requestId } = friendRequest
    const friendAccountKey = new PublicKey(requestId)

    await $BlockchainClient.removeFriendRequest(friendAccountKey)

    commit('removeOutgoingRequest', requestId)
  },

  /**
   * @method removeFriend
   * @description Remove a friend
   * @param friend  The friend to remove
   * @example
   */
  async removeFriend(
    { commit }: ActionsArguments<FriendsState>,
    friend: Friend,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const payerAccount = await $BlockchainClient.payerAccount

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const { account, address } = friend

    await $BlockchainClient.removeFriend(new PublicKey(account.accountId))

    commit('removeFriend', address)

    await db.friends.where('address').equals(address).delete()
  },

  /**
   * @method closeAccount
   * @description Close a friend request
   * @param accountId The account id of the friend to close
   * @example
   */
  async closeAccount({}: ActionsArguments<FriendsState>, accountId: string) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const payerAccount = await $BlockchainClient.payerAccount

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendAccountKey = new PublicKey(accountId)

    await $BlockchainClient.closeFriendRequest(friendAccountKey)
  },
}
