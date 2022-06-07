import { GetterTree } from 'vuex'
import { cloneDeep, Dictionary } from 'lodash'
import { FriendsState } from './types'
import { Friend, OutgoingRequest } from '~/types/ui/friends'
import { RootState } from '~/types/store/store'
import { getAlphaSorted } from '~/libraries/ui/Friends'

export interface FriendsGetters {
  /**
   * @description Find friends based on textilePubkey
   * @argument key Identifier for the search (query)
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  findFriendByKey(
    state: FriendsState,
  ): (identifier: string) => Friend | undefined
  /**
   * @description Find friends who are currently active by address
   * @argument {string} address Address as the identifier for the search (query)
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  findFriendByAddress(
    state: FriendsState,
  ): (address: string) => Friend | undefined
  /**
   * @description Find friends who are currently active
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  getActiveFriend(state: FriendsState): Friend | undefined
  /**
   * @argument address Address of the friend you are looking for
   * @returns {boolean} whether friend exists
   */
  friendExists(state: FriendsState): (address: string) => boolean
  /**
   * @description Find the first retrieved active call
   * @returns object containing an active call in the form of the Friend interface if an active call are found, returns undefined if no active calls are found
   */
  matchesActiveCall(
    state: FriendsState,
    getters: FriendsGetters,
    rootState: RootState,
  ): Friend | undefined
  /**
   * @descriptionFind at minimum a single active call in the array (state), a single active call being found will return true; else it returns false
   * @returns True if an active call are found, False if no active calls are found
   */
  matchesSomeActiveCall(
    state: FriendsState,
    getters: FriendsGetters,
    rootState: RootState,
  ): boolean
  /**
   * @description Get friends sorted by alpha
   * @returns dictionary of Friends
   */
  alphaSortedFriends(state: FriendsState): Dictionary<Friend[]>
  /**
   * @description Get outgoing requests sorted by alpha
   * @returns array of requests
   */
  alphaSortedOutgoing(state: FriendsState): OutgoingRequest[]
  /**
   * @description filter friends based on the presence of unread messages
   * @returns array of friends
   */
  friendsWithUnreadMessages(state: FriendsState): Friend[]
}

const getters: GetterTree<FriendsState, RootState> & FriendsGetters = {
  findFriendByKey:
    (state: FriendsState) =>
    (key: Friend['textilePubkey']): Friend | undefined => {
      return state.all.find((f) => {
        return f.textilePubkey === key
      })
    },
  findFriendByAddress:
    (state: FriendsState) =>
    (address: string): Friend | undefined => {
      return state.all.find((fr: Friend) => fr.address === address)
    },
  getActiveFriend: (state: FriendsState): Friend | undefined => {
    return state.all.find((f) => f.state === 'online')
  },
  friendExists:
    (state: FriendsState) =>
    (address: string): boolean => {
      return state.all.some((fr: Friend) => fr.address === address)
    },
  matchesActiveCall: (
    state: FriendsState,
    getters: FriendsGetters,
    rootState: RootState,
  ): Friend | undefined => {
    return state.all.find(
      (friend: Friend) =>
        friend.address === rootState.webrtc.activeCall?.peerId,
    )
  },
  matchesSomeActiveCall: (
    state: FriendsState,
    getters: FriendsGetters,
    rootState: RootState,
  ): boolean => {
    return state.all.some(
      (friend: Friend) =>
        friend.address === rootState.webrtc.activeCall?.peerId,
    )
  },
  alphaSortedFriends: (state: FriendsState): Dictionary<Friend[]> => {
    return getAlphaSorted(state.all)
  },
  alphaSortedOutgoing: (state: FriendsState): OutgoingRequest[] => {
    return cloneDeep(state.outgoingRequests).sort(
      (a: OutgoingRequest, b: OutgoingRequest) =>
        (a.userInfo?.name ?? '').localeCompare(b.userInfo?.name ?? ''),
    )
  },
  friendsWithUnreadMessages: (state: FriendsState): Friend[] => {
    return state.all.filter((friend) => friend.unreadCount)
  },
}

export default getters
