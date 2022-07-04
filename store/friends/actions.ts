import { PublicKey } from '@solana/web3.js'
import { keys } from 'libp2p-crypto'
import { createFromPubKey } from 'peer-id'
import Vue from 'vue'
import { uniqBy, find } from 'lodash'
import {
  AcceptFriendRequestArguments,
  CreateFriendRequestArguments,
  friendAccountToIncomingRequest,
  friendAccountToOutgoingRequest,
  FriendsError,
  FriendsState,
} from './types'
import { FriendsGetters } from './getters'
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
import {
  Friend,
  FriendRequest,
  IncomingRequest,
  OutgoingRequest,
} from '~/types/ui/friends'
import BlockchainClient from '~/libraries/BlockchainClient'
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'

export default {
  async initialize({ dispatch, commit }: ActionsArguments<FriendsState>) {
    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Loading },
      { root: true },
    )

    await Promise.all([
      dispatch('fetchFriends', {}),
      dispatch('fetchFriendRequests', {}),
      dispatch('subscribeToFriendsEvents', {}),
    ])

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
    await iridium.friends?.fetch()

    const requests = await iridium.friends?.getRequests()
    console.log('requests', requests)

    if (!requests) return

    const incomingRequests: any[] = []
    const outgoingRequests: any[] = []

    Object.entries(requests).forEach(([_key, request]) => {
      console.log(_key, request)

      const req = {
        from: request.user.did,
        pending: true,
        requestId: request.user.did,
        userInfo: {
          username: request.user.name,
          status: request.user.status,
          photoHash: request.user.photoHash,
          address: request.user.did,
        },
      }

      if (request.incoming) {
        incomingRequests.push(req)
      } else {
        outgoingRequests.push(req)
      }
    })

    console.log(outgoingRequests)

    commit('setIncomingRequests', uniqBy(incomingRequests, 'requestId'))
    commit('setOutgoingRequests', uniqBy(outgoingRequests, 'requestId'))
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

    await iridium.friends?.fetch()

    const friends = await iridium.friends?.getFriends()

    if (!friends) return

    console.log('Friends', friends)
    // const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    // const { incoming, outgoing } = await $BlockchainClient.getFriendsByStatus(
    //   FriendStatus.ACCEPTED,
    // )

    // // Concat incoming and outgoing friends into a single array
    // // and fetch user info for each friend
    // const friendData = incoming.concat(outgoing)

    // await Promise.all(
    //   friendData.map((data) => dispatch('fetchFriendDetails', data)),
    // )

    Object.entries(friends).forEach(([_key, friend]) => {
      console.log('Add friend', _key, friend)

      commit('addFriend', {
        name: friend.name,
        profilePicture: friend.photoHash,
        status: friend.status,
        pending: false,
        address: friend.did,
        state: 'offline',
        unreadCount: 0,
        peerId: friend.peerId,
      })
    })

    commit(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Ready },
      { root: true },
    )
  },

  // /**
  //  * @method fetchFriendDetails DocsTODO
  //  * @description
  //  * @param friendAccount
  //  * @example
  //  */
  // async fetchFriendDetails(
  //   {
  //     commit,
  //     rootState,
  //     dispatch,
  //     getters,
  //   }: ActionsArguments<FriendsState, FriendsGetters>,
  //   friendAccount: FriendAccount,
  // ): Promise<void> {
  //   // First grab the users from local db
  //   const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
  //   const $Crypto: Crypto = Vue.prototype.$Crypto

  //   // Check if the request was originally sent by the current user (outgoing)
  //   // and then accepted, or the other way round
  //   const userKey = rootState.accounts.active
  //   const sentByMe = friendAccount.from === userKey
  //   const friendKey = sentByMe ? friendAccount.to : friendAccount.from
  //   const encryptedTextilePubkey = sentByMe
  //     ? friendAccount.toMailboxId
  //     : friendAccount.fromMailboxId

  //   // Initialize encryption engine for the given recipient and decrypt
  //   // the mailboxId
  //   await $Crypto.initializeRecipient(new PublicKey(friendKey))
  //   const textilePubkey = await $Crypto.decryptFrom(
  //     friendKey,
  //     encryptedTextilePubkey,
  //   )

  //   const userInfo = await $BlockchainClient.getUserInfo(friendKey)

  //   if (!userInfo) {
  //     throw new Error(FriendsError.FRIEND_INFO_NOT_FOUND)
  //   }

  //   const peerId = await createFromPubKey(
  //     keys.supportedKeys.ed25519.unmarshalEd25519PublicKey(
  //       new PublicKey(friendKey).toBytes(),
  //     ).bytes,
  //   )
  //   const friendExists = getters.friendExists(friendKey)

  //   const friend: Omit<Friend, 'publicKey' | 'typingState' | 'lastUpdate'> = {
  //     account: friendAccount,
  //     name: userInfo.name,
  //     profilePicture: userInfo.photoHash,
  //     status: userInfo.status,
  //     encryptedTextilePubkey,
  //     textilePubkey,
  //     item: {},
  //     pending: false,
  //     stored: friendExists,
  //     address: friendKey,
  //     state: 'offline',
  //     unreadCount: 0,
  //     peerId: peerId.toB58String(),
  //   }

  //   if (!friendExists) {
  //     commit('addFriend', friend)
  //     const p2p = Peer2Peer.instance
  //     // check if accepted friend is online on the peers network, if so? set their status online immediately
  //     if (p2p && p2p.node) {
  //       for (const [onlinePeerId] of p2p.node?.peerStore?.peers?.entries()) {
  //         if (onlinePeerId === peerId.toB58String()) {
  //           dispatch(
  //             'friends/setFriendState',
  //             {
  //               address: friend.address,
  //               state: 'online',
  //             },
  //             { root: true },
  //           )
  //           dispatch('textile/subscribeToMailbox', {}, { root: true })
  //         }
  //       }
  //     }

  //     // Eventually delete the related friend request
  //     commit('removeIncomingRequest', friendAccount.accountId)
  //     commit('removeOutgoingRequest', friendAccount.accountId)
  //     dispatch('syncFriendIDB', friend)
  //     return
  //   }

  //   commit('updateFriend', friend)
  //   dispatch('syncFriendIDB', friend)

  //   // Try update the webrtc connection
  //   if (rootState.textile.activeConversation === friendKey) {
  //     dispatch(
  //       'conversation/setConversation',
  //       {
  //         id: friend.peerId,
  //         type: 'friend',
  //         participants: [],
  //       },
  //       { root: true },
  //     )
  //     dispatch('conversation/addParticipant', friend.address, { root: true })
  //     return
  //   }
  //   commit(
  //     'conversation/updateParticipant',
  //     {
  //       address: friend.address,
  //       peerId: friend.peerId,
  //     },
  //     { root: true },
  //   )
  // },
  // /**
  //  * @method syncFriendIDB sync a friend with the local indexedDB
  //  * @param arguments AccountArguments (dispatch)
  //  * @param friend Friend
  //  * @returns void
  //  */
  // async syncFriendIDB(
  //   { commit }: ActionsArguments<FriendsState>,
  //   friend: Friend,
  // ) {
  //   const record = {
  //     address: friend.address,
  //     name: friend.name,
  //     photoHash: friend.photoHash,
  //     textilePubkey: friend.textilePubkey,
  //     lastUpdate: friend.lastUpdate,
  //   }
  //   db.search.friends.add(record)
  //   if (
  //     (await db.friends.where('address').equals(friend.address).count()) === 0
  //   ) {
  //     await db.friends.add(record)
  //   }
  //   await db.friends.update(record.address, record)

  //   // update stored state
  //   commit('friends/setStored', friend, { root: true })
  // },

  // /**
  //  * @description Update a metadata to a given friend
  //  * @param param0 Action Arguments
  //  * @param param1 an object containing the recipient address and metadata
  //  */
  // async updateFriendMetadata(
  //   { commit, rootState }: ActionsArguments<FriendsState>,
  //   { to, metadata }: { to: string; metadata: FriendMetadata },
  // ) {
  //   const friend = rootState.friends.all.find((fr) => fr.address === to)

  //   if (!friend) {
  //     throw new Error(TextileError.FRIEND_NOT_FOUND)
  //   }
  //   const updatedFriend = {
  //     ...friend,
  //     metadata,
  //   }
  //   commit('friends/updateFriend', updatedFriend, { root: true })
  //   if (rootState.ui.userProfile) {
  //     const userProfile: Friend = rootState.ui.userProfile as Friend
  //     if (userProfile.address === to) {
  //       commit('ui/setUserProfile', updatedFriend, { root: true })
  //     }
  //   }
  //   const $TextileManager: TextileManager = Vue.prototype.$TextileManager

  //   if (!$TextileManager.metadataManager) {
  //     throw new Error(TextileError.METADATA_MANAGER_NOT_FOUND)
  //   }
  //   const $MetadataManager: MetadataManager = $TextileManager.metadataManager
  //   friend.metadata = metadata
  //   await $MetadataManager.updateFriendMetadata({ to, metadata })
  // },
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
    iridium.friends?.on('request/changed', () => {
      dispatch('fetchFriendRequests')
    })

    logger.log('FRIENDS', 'Subscribed to friend activity', iridium.friends)

    // const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    // $BlockchainClient.subscribeToEvents()
    // $BlockchainClient.addFriendEventListener(
    //   FriendsEvents.NEW_REQUEST,
    //   async (account) => {
    //     if (!account) return
    //     const userInfo = await $BlockchainClient.getUserInfo(account.from)
    //     const existingRequest = find(rootState.friends.incomingRequests, {
    //       from: account.from,
    //     })
    //     if (!existingRequest) {
    //       commit(
    //         'addIncomingRequest',
    //         friendAccountToIncomingRequest(account, userInfo),
    //       )
    //     }
    //   },
    // )
    // $BlockchainClient.addFriendEventListener(
    //   FriendsEvents.NEW_FRIEND,
    //   (account) => {
    //     if (!account) return
    //     dispatch('fetchFriendDetails', account)
    //   },
    // )
    // $BlockchainClient.addFriendEventListener(
    //   FriendsEvents.REQUEST_DENIED,
    //   (account) => {
    //     if (!account) return
    //     commit('removeOutgoingRequest', account.accountId)
    //   },
    // )
    // $BlockchainClient.addFriendEventListener(
    //   FriendsEvents.REQUEST_REMOVED,
    //   (account) => {
    //     if (!account) return
    //     commit('removeIncomingRequest', account.accountId)
    //   },
    // )
    // $BlockchainClient.addFriendEventListener(
    //   FriendsEvents.FRIEND_REMOVED,
    //   (account) => {
    //     if (!account) return
    //     const sentByMe = rootState.accounts.active === account.from
    //     const address = sentByMe ? account.to : account.from
    //     commit('removeFriend', address)
    //   },
    // )
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
    await iridium.friends?.createFriendRequest(friendToKey)

    const user = {
      did: friendToKey,
      name: friendToKey,
      status: 'offline',
    }

    const request = await iridium.friends?.getRequest(friendToKey)

    console.log('Request that has been sent', request)

    // const req = {
    //   from: request.user.did,
    //   pending: true,
    //   requestId: request.user.did,
    //   userInfo: {
    //     username: request.user.name,
    //     status: request.user.status,
    //     photoHash: request.user.photoHash,
    //     address: request.user.did,
    //   },
    // }

    // commit('addOutgoingRequest', req)

    // const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    // const $Crypto: Crypto = Vue.prototype.$Crypto
    // const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    // const textilePublicKey = $TextileManager.getIdentityPublicKey()

    // if (!textilePublicKey) {
    //   throw new Error(FriendsError.TEXTILE_NOT_INITIALIZED)
    // }

    // const { publicKey: friendFromKey } =
    //   await $BlockchainClient.getFriendsPayer()
    // const accountKeys = await $BlockchainClient.computeAccountKeys(
    //   friendFromKey,
    //   friendToKey,
    // )

    // const accountStatus = await $BlockchainClient.getAccountStatus(
    //   accountKeys.request,
    // )

    // if (accountStatus === FriendStatus.PENDING) {
    //   throw new Error(FriendsError.REQUEST_ALREADY_SENT)
    // }

    // if (accountStatus === FriendStatus.ACCEPTED) {
    //   throw new Error(FriendsError.REQUEST_ALREADY_ACCEPTED)
    // }

    // // Initialize current recipient for encryption
    // await $Crypto.initializeRecipient(friendToKey)

    // // Encrypt textile mailbox id for the recipient
    // const encryptedTextilePublicKey = await $Crypto.encryptFor(
    //   friendToKey.toBase58(),
    //   textilePublicKey,
    // )

    // await $BlockchainClient.makeFriendRequest(
    //   accountKeys.request,
    //   accountKeys.first,
    //   accountKeys.second,
    //   encryptedTextilePublicKey,
    // )

    // const friendAccountInfo = await $BlockchainClient.getFriendAccount(
    //   accountKeys.request,
    // )

    // if (friendAccountInfo) {
    //   const userInfo = await $BlockchainClient.getUserInfo(friendAccountInfo.to)
    //   commit(
    //     'addOutgoingRequest',
    //     friendAccountToOutgoingRequest(friendAccountInfo, userInfo),
    //   )
    // }
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
    { commit, dispatch, rootState }: ActionsArguments<FriendsState>,
    friend: Friend,
  ) {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    const payerAccount = await $BlockchainClient.payerAccount

    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const { account, address } = friend

    await $BlockchainClient.removeFriend(new PublicKey(account.accountId))

    // destroy active call if it was with removed friend
    if (friend.peerId === rootState.webrtc.activeCall?.peerId) {
      dispatch('webrtc/hangUp', null, { root: true })
    }

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

export const exportForTesting = {
  friendAccountToIncomingRequest,
  friendAccountToOutgoingRequest,
}
