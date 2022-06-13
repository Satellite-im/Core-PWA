import { GetterTree } from 'vuex'
import { Dictionary, groupBy } from 'lodash'
import { FriendsState } from './types'
import { Friend, OutgoingRequest } from '~/types/ui/friends'
import { RootState } from '~/types/store/store'

export interface FriendsGetters {
  findFriendByKey(
    state: FriendsState,
  ): (identifier: string) => Friend | undefined
  findFriendByAddress(
    state: FriendsState,
  ): (address: string) => Friend | undefined
  getActiveFriend(state: FriendsState): Friend | undefined
  friendExists(state: FriendsState): (address: string) => boolean
  matchesActiveCall(
    state: FriendsState,
    getters: FriendsGetters,
    rootState: RootState,
  ): Friend | undefined
  matchesSomeActiveCall(
    state: FriendsState,
    getters: FriendsGetters,
    rootState: RootState,
  ): boolean
  alphaSortedFriends(state: FriendsState): Dictionary<Friend[]>
  alphaSortedFriendsSearch(
    state: FriendsState,
  ): (searchTerm: string) => Dictionary<Friend[]>
  alphaSortedOutgoing(state: FriendsState): OutgoingRequest[]
  friendsWithUnreadMessages(state: FriendsState): Friend[]
}

const getters: GetterTree<FriendsState, RootState> & FriendsGetters = {
  /**
   * @name findFriend
   * @description Find friends based on identifiers {name,address,textilePubkey}
   * @argument identifier Identifier for the search (query)
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  findFriendByKey:
    (state: FriendsState) =>
    (key: Friend['textilePubkey']): Friend | undefined => {
      return state.all.find((f) => {
        return f.textilePubkey === key
      })
    },
  /**
   * @name findFriendByAddress
   * @description Find friends who are currently active by address
   * @argument {string} address Address as the identifier for the search (query)
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  findFriendByAddress:
    (state: FriendsState) =>
    (address: string): Friend | undefined => {
      return state.all.find((fr: Friend) => fr.address === address)
    },

  /**
   * @name getActiveFriend
   * @description Find friends who are currently active
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  getActiveFriend: (state: FriendsState): Friend | undefined => {
    return state.all.find((f) => f.state === 'online')
  },

  /** @function
   * Determine the existence of a friend
   * @name friendExists
   * @argument address Address of the friend you are looking for
   * @returns True if friend is found (exists), False if friend is not found (does not exist)
   */
  friendExists:
    (state: FriendsState) =>
    (address: string): boolean => {
      return state.all.some((fr: Friend) => fr.address === address)
    },

  /**
   * @name matchesActiveCall
   * @description Find the first retrieved active call
   * @returns object containing an active call in the form of the Friend interface if an active call are found, returns undefined if no active calls are found
   */
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

  /**
   * @name matchesSomeActiveCall
   * @descriptionFind at minimum a single active call in the array (state), a single active call being found will return true; else it returns false
   * @returns True if an active call are found, False if no active calls are found
   */
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

  /**
   * @name alphaSortedFriends
   * @description Get friends sorted by alpha
   * @returns dictionary of Friends
   */
  alphaSortedFriends: (state: FriendsState): Dictionary<Friend[]> => {
    const sorted = [...state.all].sort((a, b) => a.name.localeCompare(b.name))
    return groupBy(sorted, (f: Friend) => {
      if (f.name && f.name.length) {
        return f.name.toUpperCase()[0]
      }
      return '-'
    })
  },

  /**
   * @name alphaSortedFriends
   * @description Get friends sorted by alpha
   * @returns dictionary of Friends
   */
  alphaSortedFriendsSearch:
    (state: FriendsState) =>
    (searchTerm: string): Dictionary<Friend[]> => {
      const filtered = state.all.filter((f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))
      return groupBy(sorted, (f: Friend) => {
        if (f.name && f.name.length) {
          return f.name.toUpperCase()[0]
        }
        return '-'
      })
    },

  /**
   * @name alphaSortedOutgoing
   * @description Get outgoing requests sorted by alpha
   * @returns array of requests
   */
  alphaSortedOutgoing: (state: FriendsState): OutgoingRequest[] => {
    return [...state.outgoingRequests].sort(
      (a: OutgoingRequest, b: OutgoingRequest) =>
        (a.userInfo?.name ?? '').localeCompare(b.userInfo?.name ?? ''),
    )
  },
  friendsWithUnreadMessages: (state: FriendsState): Friend[] => {
    return state.all // .filter((friend) => friend.unreadCount)
  },
}

export default getters
