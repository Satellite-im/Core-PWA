import PeerId from 'peer-id'
import { keys } from 'libp2p-crypto'
import { PublicKey } from '@solana/web3.js'

import Vue from 'vue'
import { DataStateType } from '../dataState/types'
import { TextileError } from '../textile/types'
import {
  AcceptFriendRequestArguments,
  CreateFriendRequestArguments,
  FriendsError,
  FriendsState,
} from './types'
import Crypto from '~/libraries/Crypto/Crypto'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import FriendsProgram from '~/libraries/Solana/FriendsProgram/FriendsProgram'
import {
  FriendAccount,
  FriendsEvents,
  FriendStatus,
} from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { AccountsError } from '~/store/accounts/types'
import {
  Friend,
  FriendRequest,
  IncomingRequest,
  OutgoingRequest,
} from '~/types/ui/friends'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import UsersProgram, {
  UserInfo,
} from '~/libraries/Solana/UsersProgram/UsersProgram'
import { MetadataManager } from '~/libraries/Textile/MetadataManager'
import { FriendMetadata } from '~/types/textile/metadata'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'

export default {
  async initialize({
    dispatch,
    commit,
    state,
  }: ActionsArguments<FriendsState>) {
    const $Hounddog = Vue.prototype.$Hounddog

    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Loading },
      { root: true },
    )

    const friends = await db.friends.toArray()
    db.search.friends.update(friends)
    friends.forEach((friend) => {
      const friendExists = $Hounddog.friendExists(state, friend)

      if (!friendExists) {
        commit('addFriend', { ...friend, stored: true })
        return
      }
      commit('updateFriend', { ...friend, stored: true })
    })

    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Ready },
      { root: true },
    )

    dispatch('friends/fetchFriends', {}, { root: true })
    dispatch('friends/fetchFriendRequests', {}, { root: true })
    dispatch('friends/subscribeToFriendsEvents', {}, { root: true })
  },
  /**
   * @method fetchFriendRequests DocsTODO
   * @description
   * @param
   * @example
   */
  async fetchFriendRequests({ commit }: ActionsArguments<FriendsState>) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const usersProgram: UsersProgram = new UsersProgram($SolanaManager)

    const { incoming, outgoing } =
      await friendsProgram.getFriendAccountsByStatus(FriendStatus.PENDING)

    const incomingRequests = await Promise.all(
      incoming.map(async (account) => {
        const userInfo = await usersProgram.getUserInfo(account.from)
        return friendAccountToIncomingRequest(account, userInfo)
      }),
    )

    const outgoingRequests = await Promise.all(
      outgoing.map(async (account) => {
        const userInfo = await usersProgram.getUserInfo(account.to)
        return friendAccountToOutgoingRequest(account, userInfo)
      }),
    )

    commit('setIncomingRequests', incomingRequests)
    commit('setOutgoingRequests', outgoingRequests)
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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const { incoming, outgoing } =
      await friendsProgram.getFriendAccountsByStatus(FriendStatus.ACCEPTED)

    const allFriendsData = [...incoming, ...outgoing]

    allFriendsData.forEach((friendData) => {
      dispatch('fetchFriendDetails', friendData)
    })

    // // Attempt RTC Connection to all friends
    // // TODO: We should probably only try to connect to friends we're actually chatting with
    // // If they call us we'll accept their connection
    // dispatch('webrtc/startup', allFriendsData, { root: true })

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
    { commit, state, rootState, dispatch }: ActionsArguments<FriendsState>,
    friendAccount: FriendAccount,
  ) {
    // First grab the users from local db
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const usersProgram: UsersProgram = new UsersProgram($SolanaManager)
    const $Crypto: Crypto = Vue.prototype.$Crypto

    // Check if the request was originally sent by the current user (outgoing)
    // and then accepted, or the other way round
    const userKey = rootState.accounts.active
    const sentByMe = friendAccount.from === userKey
    const friendKey = sentByMe ? friendAccount.to : friendAccount.from
    const encryptedTextilePubkey = sentByMe
      ? friendAccount.toMailboxId
      : friendAccount.fromMailboxId

    // Initialize encryption engine for the given recipient and decrypt
    // the mailboxId
    await $Crypto.initializeRecipient(new PublicKey(friendKey))
    const textilePubkey = await $Crypto.decryptFrom(
      friendKey,
      encryptedTextilePubkey,
    )

    const userInfo = await usersProgram.getUserInfo(friendKey)

    if (!userInfo) {
      throw new Error(FriendsError.FRIEND_INFO_NOT_FOUND)
    }

    const peerId = await PeerId.createFromPubKey(
      keys.supportedKeys.ed25519.unmarshalEd25519PublicKey(
        new PublicKey(friendKey).toBytes(),
      ).bytes,
    )

    const stored = state.all.some((friend) => friend.address === friendKey)
    const friend: Omit<Friend, 'publicKey' | 'typingState' | 'lastUpdate'> = {
      account: friendAccount,
      name: userInfo.name,
      profilePicture: userInfo.photoHash,
      status: userInfo.status,
      encryptedTextilePubkey,
      textilePubkey,
      item: {},
      pending: false,
      stored,
      activeChat: false,
      address: friendKey,
      state: 'offline',
      unreadCount: 0,
      peerId: peerId.toB58String(),
    }
    const $Hounddog = Vue.prototype.$Hounddog
    const friendExists = $Hounddog.friendExists(state, friend)

    if (!friendExists) {
      commit('addFriend', friend)

      // Try create the webrtc connection
      dispatch('webrtc/createPeerConnection', friend.address, { root: true })

      // Eventually delete the related friend request
      commit(
        'removeIncomingRequest',
        friendAccountToIncomingRequest(friendAccount, null).requestId,
      )
      commit(
        'removeOutgoingRequest',
        friendAccountToOutgoingRequest(friendAccount, null).requestId,
      )
      dispatch('syncFriendIDB', friend)
      return
    }
    commit('updateFriend', friend)

    dispatch('syncFriendIDB', friend)
  },
  /**
   * @method syncFriendIDB sync a friend with the local indexedDB
   * @param arguments AccountArguments (dispatch)
   * @param friend Friend
   * @returns void
   */
  async syncFriendIDB(
    { commit }: ActionsArguments<FriendsState>,
    friend: Friend,
  ) {
    const record = {
      address: friend.address,
      name: friend.name,
      photoHash: friend.photoHash,
      textilePubkey: friend.textilePubkey,
      lastUpdate: friend.lastUpdate,
    }
    db.search.friends.add(record)
    if (
      (await db.friends.where('address').equals(friend.address).count()) === 0
    ) {
      await db.friends.add(record)
    }
    await db.friends.update(record.address, record)

    // update stored state
    commit('friends/setStored', friend, { root: true })
  },

  /**
   * @description Update a metadata to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address and metadata
   */
  async updateFriendMetadata(
    { commit, rootState, dispatch }: ActionsArguments<FriendsState>,
    { to, metadata }: { to: string; metadata: FriendMetadata },
  ) {
    const friend = rootState.friends.all.find((fr) => fr.address === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }
    const updatedFriend = {
      ...friend,
      metadata,
    }
    commit('friends/updateFriend', updatedFriend, { root: true })
    if (rootState.ui.userProfile) {
      const userProfile: Friend = rootState.ui.userProfile as Friend
      if (userProfile.address === to) {
        commit('ui/setUserProfile', updatedFriend, { root: true })
      }
    }
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.metadataManager) {
      throw new Error(TextileError.METADATA_MANAGER_NOT_FOUND)
    }
    const $MetadataManager: MetadataManager = $TextileManager.metadataManager
    friend.metadata = metadata
    await $MetadataManager.updateFriendMetadata({ to, metadata })
  },
  setFriendState(
    { commit }: ActionsArguments<FriendsState>,
    { address, state }: { address: string; state: string },
  ) {
    commit('friends/updateFriend', { address, state }, { root: true })
  },
  /**
   * @method subscribeToFriendsEvents DocsTODO
   * @description
   * @param
   * @example
   */
  subscribeToFriendsEvents({
    dispatch,
    commit,
    rootState,
  }: ActionsArguments<FriendsState>) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const usersProgram: UsersProgram = new UsersProgram($SolanaManager)

    friendsProgram.subscribeToFriendsEvents()

    friendsProgram.addEventListener(
      FriendsEvents.NEW_REQUEST,
      async (account) => {
        if (account) {
          const userInfo = await usersProgram.getUserInfo(account.from)
          commit(
            'addIncomingRequest',
            friendAccountToIncomingRequest(account, userInfo),
          )
        }
      },
    )

    friendsProgram.addEventListener(FriendsEvents.NEW_FRIEND, (account) => {
      if (account) {
        dispatch('fetchFriendDetails', account)
      }
    })

    friendsProgram.addEventListener(FriendsEvents.REQUEST_DENIED, (account) => {
      if (account) {
        const requestId = friendAccountToOutgoingRequest(
          account,
          null,
        ).requestId
        commit('removeOutgoingRequest', requestId)
        commit('removeIncomingRequest', requestId)
      }
    })

    friendsProgram.addEventListener(
      FriendsEvents.REQUEST_REMOVED,
      (account) => {
        if (account) {
          commit(
            'removeIncomingRequest',
            friendAccountToIncomingRequest(account, null).requestId,
          )
        }
      },
    )

    friendsProgram.addEventListener(FriendsEvents.FRIEND_REMOVED, (account) => {
      if (account) {
        const address =
          rootState.accounts.active === account.from ? account.to : account.from
        commit('removeFriend', address)
      }
    })
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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const $Crypto: Crypto = Vue.prototype.$Crypto
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const usersProgram: UsersProgram = new UsersProgram($SolanaManager)

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    if (!textilePublicKey) {
      throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    }

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const friendAccountKey = await friendsProgram.computeFriendAccountKey(
      payerAccount.publicKey,
      friendToKey,
    )

    let friendAccountInfo = await friendsProgram.getFriend(friendAccountKey)

    const friendAccountMirroredKey =
      await friendsProgram.computeFriendAccountKey(
        friendToKey,
        payerAccount.publicKey,
      )

    let friendAccountMirroredInfo = await friendsProgram.getFriend(
      friendAccountMirroredKey,
    )

    if (!friendAccountInfo) {
      friendAccountInfo = await friendsProgram.createFriend(
        payerAccount.publicKey,
        friendToKey,
      )
    }

    if (!friendAccountMirroredInfo) {
      friendAccountMirroredInfo = await friendsProgram.createFriend(
        friendToKey,
        payerAccount.publicKey,
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

    // Initialize current recipient for encryption
    await $Crypto.initializeRecipient(friendToKey)

    // Encrypt textile mailbox id for the recipient
    const encryptedTextilePublicKey = await $Crypto.encryptFor(
      friendToKey.toBase58(),
      textilePublicKey,
    )

    const transactionHash = await friendsProgram.createFriendRequest(
      friendAccountKey,
      friendAccountMirroredKey,
      payerAccount,
      friendToKey,
      Buffer.from(encryptedTextilePublicKey.padStart(128, '0')),
    )

    if (transactionHash) {
      const parsedFriendRequest = await friendsProgram.getParsedFriend(
        friendAccountKey,
      )

      if (parsedFriendRequest) {
        const userInfo = await usersProgram.getUserInfo(parsedFriendRequest.to)
        commit(
          'addOutgoingRequest',
          friendAccountToOutgoingRequest(parsedFriendRequest, userInfo),
        )
      }
    }
  },
  /**
   * @method acceptFriendRequest DocsTODO
   * @description
   * @param friendRequest
   * @param textileMailboxId
   * @example
   */
  async acceptFriendRequest(
    { commit, dispatch }: ActionsArguments<FriendsState>,
    { friendRequest }: AcceptFriendRequestArguments,
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const $Crypto: Crypto = Vue.prototype.$Crypto
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    if (!textilePublicKey) {
      throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    }

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateIncomingRequest', { ...friendRequest, pending: true })
    const { account } = friendRequest

    const computedFriendAccountKey =
      await friendsProgram.computeFriendAccountKey(
        new PublicKey(account.from),
        payerAccount.publicKey,
      )

    const friendFromKey = friendRequest.account.from

    const friendCheck = await friendsProgram.getParsedFriend(
      computedFriendAccountKey,
    )
    if (friendCheck?.status === 2) {
      return
    }
    // Initialize current recipient for encryption
    await $Crypto.initializeRecipient(new PublicKey(friendFromKey))

    // Encrypt textile mailbox id for the recipient
    const encryptedIdentityPublicKey = await $Crypto.encryptFor(
      friendFromKey,
      textilePublicKey,
    )

    const transactionId = await friendsProgram.acceptFriendRequest(
      computedFriendAccountKey,
      new PublicKey(account.from),
      payerAccount,
      Buffer.from(encryptedIdentityPublicKey.padStart(128, '0')),
    )

    if (transactionId) {
      dispatch('fetchFriendDetails', account)
    }
  },
  /**
   * @method denyFriendRequest DocsTODO
   * @description
   * @param friendRequest
   * @example
   */
  async denyFriendRequest(
    { commit }: ActionsArguments<FriendsState>,
    friendRequest: FriendRequest,
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateIncomingRequest', { ...friendRequest, pending: true })

    const { account } = friendRequest

    const computedFriendAccountKey =
      await friendsProgram.computeFriendAccountKey(
        new PublicKey(account.from),
        payerAccount.publicKey,
      )

    const transactionId = await friendsProgram.denyFriendRequest(
      computedFriendAccountKey,
      new PublicKey(account.from),
      payerAccount,
    )

    if (transactionId) {
      commit(
        'removeIncomingRequest',
        friendAccountToIncomingRequest(account, null).requestId,
      )
    }
  },
  /**
   * @method removeFriendRequest DocsTODO
   * @description
   * @param friendRequest
   * @example
   */
  async removeFriendRequest(
    { commit }: ActionsArguments<FriendsState>,
    friendRequest: OutgoingRequest,
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateOutgoingRequest', { ...friendRequest, pending: true })

    const { account } = friendRequest

    const computedFriendAccountMirroredKey =
      await friendsProgram.computeFriendAccountKey(
        payerAccount.publicKey,
        new PublicKey(account.to),
      )

    const transactionId = await friendsProgram.removeFriendRequest(
      computedFriendAccountMirroredKey,
      payerAccount,
      new PublicKey(account.to),
    )

    if (transactionId) {
      commit(
        'removeOutgoingRequest',
        friendAccountToOutgoingRequest(account, null).requestId,
      )
    }
  },
  /**
   * @method removeFriend DocsTODO
   * @description
   * @param friend
   * @example
   */
  async removeFriend(
    { commit }: ActionsArguments<FriendsState>,
    friend: Friend,
  ) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const { account } = friend

    const transactionId = await friendsProgram.removeFriend(
      account,
      payerAccount,
    )

    if (transactionId) {
      commit('removeFriend', friend.address)
    }
  },
}

/**
 * Utility function that converts a FriendAccount
 * into an strongly typed IncomingRequest
 * @param friendAccount the FriendAccount data
 * @returns IncomingRequest object
 */
function friendAccountToIncomingRequest(
  friendAccount: FriendAccount,
  userInfo: UserInfo | null,
): IncomingRequest {
  return {
    requestId: friendAccount.accountId,
    from: friendAccount.from,
    account: friendAccount,
    pending: false,
    userInfo,
  }
}

/**
 * Utility function that converts a FriendAccount
 * into an strongly typed OutgoingRequest
 * @param friendAccount the FriendAccount data
 * @returns OutgoingRequest object
 */
function friendAccountToOutgoingRequest(
  friendAccount: FriendAccount,
  userInfo: UserInfo | null,
): OutgoingRequest {
  return {
    requestId: friendAccount.accountId,
    to: friendAccount.to,
    account: friendAccount,
    pending: false,
    userInfo,
  }
}
