import Vue from 'vue'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import TextileManager from '~/libraries/Textile/TextileManager'
import { FriendsState } from '~/store/friends/types'
import { RootState } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'

// Hounddog, is used to clean up searching and finding data in our application.
export default class Hounddog {
  private _TextileManager: TextileManager
  private _SolanaManager: SolanaManager
  private _Store: {
    state: RootState
  }

  constructor(store: { state: RootState }) {
    this._TextileManager = Vue.prototype.$TextileManager
    this._SolanaManager = Vue.prototype.$SolanaManager
    this._Store = store
  }

  /** @function
   * Find friends based on identifiers {name,address,textilePubkey}
   * @name findFriend
   * @argument identifier Identifier for the search (query)
   * @argument state Object that contains an array that will be searched
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  findFriend(
    identifier:
      | Friend['name']
      | Friend['address']
      | Friend['textilePubkey']
      | string,
    state: FriendsState,
  ): Friend | undefined {
    return state.all.find((f) => {
      return (
        f.name === identifier ||
        f.address === identifier ||
        f.account?.accountId === identifier ||
        f.textilePubkey === identifier
      )
    })
  }

  /** @function
   * Find friends who are currently active by address
   * @name findFriendByAddress
   * @argument address Address as the identifier for the search (query)
   * @argument state Object that contains an array that will be searched for an active chat
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  findFriendByAddress(
    address: string,
    state: FriendsState,
  ): Friend | undefined {
    return state.all.find((fr: Friend) => fr.address === address)
  }

  /** @function
   * Find friends who are currently active
   * @name getActiveFriend
   * @argument state Object that contains an array that will be searched for an active chat
   * @returns object containing an active friend in the form of the Friend interface if an active friend are found, returns undefined if no values satisfy the query
   */
  getActiveFriend(state: FriendsState): Friend | undefined {
    return state.all.find((f) => f.state === 'online')
  }

  /** @function
   * Determine the existence of a friend
   * @name friendExists
   * @argument state Object that contains an array that will be searched for an active chat
   * @argument address Address of the friend you are looking for
   * @returns True if friend is found (exists), False if friend is not found (does not exist)
   */
  friendExists(state: FriendsState, address: string): Boolean {
    return state.all.some((fr: Friend) => fr.address === address)
  }

  /** @function
   * Find the first retrieved active call
   * @name matchesActiveCall
   * @argument state Object that contains an array that will be searched for the active call
   * @returns object containing an active call in the form of the Friend interface if an active call are found, returns undefined if no active calls are found
   */
  matchesActiveCall(state: any): Friend {
    return state.friends.all.find(
      (friend: Friend) => friend.address === state.webrtc.activeCall,
    )
  }

  /** @function
   * Find at minimum a single active call in the array (state), a single active call being found will return true; else it returns false
   * @name matchesSomeActiveCall
   * @argument state Object that contains an array that will be searched for the active call
   * @returns True if an active call are found, False if no active calls are found
   */
  matchesSomeActiveCall(state: any): Boolean {
    return state.friends.all.some(
      (friend: Friend) => friend.address === state.webrtc.activeCall,
    )
  }
}
