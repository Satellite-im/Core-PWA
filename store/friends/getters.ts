import { FriendsState } from './types'
import { Friend } from '~/types/ui/friends'
import { RootState } from '~/types/store/store'

const getters = {
  /**
   * @name findFriend
   * @description Find friends based on identifiers {name,address,textilePubkey}
   * @argument identifier Identifier for the search (query)
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  findFriend:
    (state: FriendsState) =>
    (
      identifier:
        | Friend['name']
        | Friend['address']
        | Friend['textilePubkey']
        | string,
    ): Friend | undefined => {
      return state.all.find((f) => {
        return (
          f.name === identifier ||
          f.address === identifier ||
          f.account?.accountId === identifier ||
          f.textilePubkey === identifier
        )
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
    (address: string): Boolean => {
      return state.all.some((fr: Friend) => fr.address === address)
    },

  /**
   * @name matchesActiveCall
   * @description Find the first retrieved active call
   * @returns object containing an active call in the form of the Friend interface if an active call are found, returns undefined if no active calls are found
   */
  matchesActiveCall: (
    state: FriendsState,
    getters: any,
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
    getters: any,
    rootState: RootState,
  ): Boolean => {
    return state.all.some(
      (friend: Friend) =>
        friend.address === rootState.webrtc.activeCall?.peerId,
    )
  },
}

export default getters
