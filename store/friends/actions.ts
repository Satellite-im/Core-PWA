import { PublicKey } from '@solana/web3.js'
import Vue from 'vue'
import { DataStateType } from '../dataState/types'
import {
  AcceptFriendRequestArguments,
  CreateFriendRequestArguments,
  FriendsError,
  FriendsState,
} from './types'
import Crypto from '~/libraries/Crypto/Crypto'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import FriendsProgram from '~/libraries/Solana/FriendsProgram/FriendsProgram'
import ServerProgram from '~/libraries/Solana/ServerProgram/ServerProgram'
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
import { RawUser } from '~/types/ui/user'
import TextileManager from '~/libraries/Textile/TextileManager'
import GroupchatsProgram from '~/libraries/Solana/GroupchatsProgram/GroupchatsProgram'

export default {
  /**
   * @method fetchFriendRequests DocsTODO
   * @description
   * @param
   * @example
   */
  async fetchFriendRequests({ commit }: ActionsArguments<FriendsState>) {
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const serverProgram: ServerProgram = new ServerProgram($SolanaManager)

    // Groupchat testing
    const groupchatsProgram: GroupchatsProgram = new GroupchatsProgram(
      $SolanaManager,
    )

    groupchatsProgram.create(
      'dhfskjdfhsdjkfhsdjkfhdsjkhdjkfdhfskjdfhsdjkfhsdjkfhdsjkhdjkfdfrt',
    )

    const { incoming, outgoing } =
      await friendsProgram.getFriendAccountsByStatus(FriendStatus.PENDING)

    const incomingRequests = await Promise.all(
      incoming.map(async (account) => {
        const userInfo = await serverProgram.getUser(
          new PublicKey(account.from),
        )
        return friendAccountToIncomingRequest(account, userInfo)
      }),
    )

    const outgoingRequests = await Promise.all(
      outgoing.map(async (account) => {
        const userInfo = await serverProgram.getUser(new PublicKey(account.to))
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
    const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
    const serverProgram: ServerProgram = new ServerProgram($SolanaManager)
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
    const rawUser = await serverProgram.getUser(new PublicKey(friendKey))
    if (!rawUser) {
      throw new Error(FriendsError.FRIEND_INFO_NOT_FOUND)
    }

    const friend: Omit<Friend, 'publicKey' | 'typingState' | 'lastUpdate'> = {
      account: friendAccount,
      name: rawUser.name,
      profilePicture: rawUser.photoHash,
      status: rawUser.status,
      encryptedTextilePubkey,
      textilePubkey,
      item: {},
      pending: false,
      activeChat: false,
      address: friendKey,
      state: 'offline',
      unreadCount: 0,
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
      return
    }
    commit('updateFriend', friend)
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

    const serverProgram: ServerProgram = new ServerProgram($SolanaManager)

    const userAccount = $SolanaManager.getActiveAccount()

    friendsProgram.subscribeToFriendsEvents()

    friendsProgram.addEventListener(
      FriendsEvents.NEW_REQUEST,
      async (account) => {
        if (account) {
          const userInfo = await serverProgram.getUser(
            new PublicKey(account.from),
          )
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
        commit(
          'removeOutgoingRequest',
          friendAccountToOutgoingRequest(account, null).requestId,
        )
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
    const serverProgram: ServerProgram = new ServerProgram($SolanaManager)

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    if (!textilePublicKey) {
      throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    }

    const payerAccount = await $SolanaManager.getActiveAccount()

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const friendAccountKey = await friendsProgram.computeFriendAccountKey(
      userAccount.publicKey,
      friendToKey,
    )

    let friendAccountInfo = await friendsProgram.getFriend(friendAccountKey)

    const friendAccountMirroredKey =
      await friendsProgram.computeFriendAccountKey(
        friendToKey,
        userAccount.publicKey,
      )

    let friendAccountMirroredInfo = await friendsProgram.getFriend(
      friendAccountMirroredKey,
    )

    if (!friendAccountInfo) {
      friendAccountInfo = await friendsProgram.createFriend(
        userAccount.publicKey,
        friendToKey,
      )
    }

    if (!friendAccountMirroredInfo) {
      friendAccountMirroredInfo = await friendsProgram.createFriend(
        friendToKey,
        userAccount.publicKey,
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
      userAccount,
      friendToKey,
      Buffer.from(encryptedTextilePublicKey.padStart(128, '0')),
    )

    if (transactionHash) {
      const parsedFriendRequest = await friendsProgram.getParsedFriend(
        friendAccountKey,
      )

      if (parsedFriendRequest) {
        const userInfo = await serverProgram.getUser(
          new PublicKey(parsedFriendRequest.to),
        )
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

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateIncomingRequest', { ...friendRequest, pending: true })
    const { account } = friendRequest

    const computedFriendAccountKey =
      await friendsProgram.computeFriendAccountKey(
        new PublicKey(account.from),
        userAccount.publicKey,
      )

    const friendFromKey = friendRequest.account.from

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
      userAccount,
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

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateIncomingRequest', { ...friendRequest, pending: true })

    const { account } = friendRequest

    const computedFriendAccountKey =
      await friendsProgram.computeFriendAccountKey(
        new PublicKey(account.from),
        userAccount.publicKey,
      )

    const transactionId = await friendsProgram.denyFriendRequest(
      computedFriendAccountKey,
      new PublicKey(account.from),
      userAccount,
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

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    commit('updateOutgoingRequest', { ...friendRequest, pending: true })

    const { account } = friendRequest

    const computedFriendAccountMirroredKey =
      await friendsProgram.computeFriendAccountKey(
        userAccount.publicKey,
        new PublicKey(account.to),
      )

    const transactionId = await friendsProgram.removeFriendRequest(
      computedFriendAccountMirroredKey,
      userAccount,
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

    const userAccount = await $SolanaManager.getUserAccount()

    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }

    const friendsProgram: FriendsProgram = new FriendsProgram($SolanaManager)

    const { account } = friend

    const transactionId = await friendsProgram.removeFriend(
      account,
      userAccount,
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
  userInfo: RawUser | null,
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
  userInfo: RawUser | null,
): OutgoingRequest {
  return {
    requestId: friendAccount.accountId,
    to: friendAccount.to,
    account: friendAccount,
    pending: false,
    userInfo,
  }
}
