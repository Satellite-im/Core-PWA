import { PublicKey } from '@solana/web3.js'
import { keys } from 'libp2p-crypto'
import { createFromPubKey } from 'peer-id'
import Vue from 'vue'
import Crypto from '~/libraries/Crypto/Crypto'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import FriendsProgram from '~/libraries/Solana/FriendsProgram/FriendsProgram'
import {
  FriendAccount,
  FriendsEvents,
  FriendStatus,
} from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'
import { MetadataManager } from '~/libraries/Textile/MetadataManager'
import TextileManager from '~/libraries/Textile/TextileManager'
import { AccountsError } from '~/store/accounts/types'
import { ActionsArguments } from '~/types/store/store'
import { FriendMetadata } from '~/types/textile/metadata'
import { Friend, FriendRequest, OutgoingRequest } from '~/types/ui/friends'
import Hounddog from '~/utilities/Hounddog'
import { DataStateType } from '../dataState/types'
import { TextileError } from '../textile/types'
import {
  AcceptFriendRequestArguments,
  CreateFriendRequestArguments,
  friendAccountToIncomingRequest,
  friendAccountToOutgoingRequest,
  FriendsError,
  FriendsState,
} from './types'

export default {
  async initialize({
    dispatch,
    commit,
    state,
  }: ActionsArguments<FriendsState>) {
    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Loading },
      { root: true },
    )

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

    const { incoming, outgoing } = await friendsProgram.getAccountsByStatus(
      FriendStatus.PENDING,
    )

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

    const { incoming, outgoing } = await friendsProgram.getAccountsByStatus(
      FriendStatus.ACCEPTED,
    )

    // Concat incoming and outgoing friends into a single array
    // and fetch user info for each friend
    incoming
      .concat(outgoing)
      .forEach((friendData) => dispatch('fetchFriendDetails', friendData))

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
    const $Hounddog: Hounddog = Vue.prototype.$Hounddog

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

    const peerId = await createFromPubKey(
      keys.supportedKeys.ed25519.unmarshalEd25519PublicKey(
        new PublicKey(friendKey).toBytes(),
      ).bytes,
    )

    const friendExists = $Hounddog.friendExists(state, friendKey)

    const friend: Omit<Friend, 'publicKey' | 'typingState' | 'lastUpdate'> = {
      account: friendAccount,
      name: userInfo.name,
      profilePicture: userInfo.photoHash,
      status: userInfo.status,
      encryptedTextilePubkey,
      textilePubkey,
      item: {},
      pending: false,
      stored: friendExists,
      address: friendKey,
      state: 'offline',
      unreadCount: 0,
      peerId: peerId.toB58String(),
    }

    if (!friendExists) {
      commit('addFriend', friend)

      // Eventually delete the related friend request
      commit('removeIncomingRequest', friendAccount.accountId)
      commit('removeOutgoingRequest', friendAccount.accountId)
      dispatch('syncFriendIDB', friend)
      return
    }

    commit('updateFriend', friend)
    dispatch('syncFriendIDB', friend)

    // Try update the webrtc connection
    if (rootState.textile.activeConversation === friendKey) {
      dispatch(
        'conversation/setConversation',
        {
          id: friend.peerId,
          type: 'friend',
          participants: [],
        },
        { root: true },
      )
      dispatch('conversation/addParticipant', friend.address, { root: true })
      return
    }
    commit(
      'conversation/updateParticipant',
      {
        address: friend.address,
        peerId: friend.peerId,
      },
      { root: true },
    )
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
    { commit, rootState }: ActionsArguments<FriendsState>,
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

    friendsProgram.subscribeToEvents()

    friendsProgram.addEventListener(
      FriendsEvents.NEW_REQUEST,
      async (account) => {
        if (!account) return
        const userInfo = await usersProgram.getUserInfo(account.from)
        commit(
          'addIncomingRequest',
          friendAccountToIncomingRequest(account, userInfo),
        )
      },
    )

    friendsProgram.addEventListener(FriendsEvents.NEW_FRIEND, (account) => {
      if (!account) return
      dispatch('fetchFriendDetails', account)
    })

    friendsProgram.addEventListener(FriendsEvents.REQUEST_DENIED, (account) => {
      if (!account) return
      commit('removeOutgoingRequest', account.accountId)
      dispatch('closeAccount', account.accountId).catch((e) => console.error(e))
    })

    friendsProgram.addEventListener(
      FriendsEvents.REQUEST_REMOVED,
      (account) => {
        if (!account) return
        commit('removeIncomingRequest', account.accountId)
      },
    )

    friendsProgram.addEventListener(FriendsEvents.FRIEND_REMOVED, (account) => {
      if (!account) return

      const sentByMe = rootState.accounts.active === account.from
      const address = sentByMe ? account.to : account.from
      commit('removeFriend', address)

      if (sentByMe) {
        dispatch('closeAccount', account.accountId).catch((e) =>
          console.error(e),
        )
      }
    })
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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const $Crypto: Crypto = Vue.prototype.$Crypto
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const usersProgram: UsersProgram = new UsersProgram($SolanaManager)

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    if (!textilePublicKey) {
      throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const { publicKey: friendFromKey } = friendsProgram.getPayer()
    const accountKeys = await friendsProgram.computeAccountKeys(
      friendFromKey,
      friendToKey,
    )

    const accountStatus = await friendsProgram.getAccountStatus(
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

    await friendsProgram.makeRequest(
      accountKeys.request,
      accountKeys.first,
      accountKeys.second,
      encryptedTextilePublicKey,
    )

    const friendAccountInfo = await friendsProgram.getAccount(
      accountKeys.request,
    )

    if (friendAccountInfo) {
      const userInfo = await usersProgram.getUserInfo(friendAccountInfo.to)
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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const $Crypto: Crypto = Vue.prototype.$Crypto
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    if (!textilePublicKey) {
      throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateIncomingRequest', { ...friendRequest, pending: true })
    const { account, requestId } = friendRequest

    const friendAccountKey = new PublicKey(requestId)

    const accountStatus = await friendsProgram.getAccountStatus(
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

        await friendsProgram.acceptRequest(
          friendAccountKey,
          encryptedTextilePublicKey,
        )

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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateIncomingRequest', { ...friendRequest, pending: true })

    const { requestId } = friendRequest

    const friendAccountKey = new PublicKey(requestId)

    await friendsProgram.denyRequest(friendAccountKey)

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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateOutgoingRequest', { ...friendRequest, pending: true })

    const { requestId } = friendRequest
    const friendAccountKey = new PublicKey(requestId)

    await friendsProgram.removeRequest(friendAccountKey)

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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const { account, address } = friend

    await friendsProgram.removeFriend(new PublicKey(account.accountId))

    commit('removeFriend', friend.address)
    if (this.app.router.currentRoute?.params?.address === address) {
      this.app.router.replace('/chat/direct')
    }
    await db.friends.where('address').equals(address).delete()
  },

  /**
   * @method closeAccount
   * @description Close a friend request
   * @param accountId The account id of the friend to close
   * @example
   */
  async closeAccount({}: ActionsArguments<FriendsState>, accountId: string) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const friendAccountKey = new PublicKey(accountId)

    await friendsProgram.closeRequest(friendAccountKey)
  },
}
