import Vue from 'vue'
import { FriendStatus } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import TextileManager from '~/libraries/Textile/TextileManager'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import { FriendsState } from '~/store/friends/types'
import { RootState } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'

// Hounddog is used to clean up searching and finding data in our application.
export default class Hounddog {
    private _WebRTC: WebRTC
    private _TextileManager: TextileManager
    private _SolanaManager: SolanaManager
    private _Store: { state: RootState }

    constructor(store: { state: RootState }) {
        this._WebRTC = Vue.prototype.$WebRTC
        this._TextileManager = Vue.prototype.$TextileManager
        this._SolanaManager = Vue.prototype.$SolanaManager
        this._Store = store
    }

    findFriend(
        identifier: Friend["name"] | Friend["address"] | Friend["textilePubkey"] | string,
        state: FriendsState
    ): Friend | undefined {
        return state.all.find(f => {
            return f.name === identifier ||
                f.address === identifier ||
                f.account.accountId === identifier ||
                f.textilePubkey === identifier || 
                f.name === identifier
        })
    }

    getActiveFriend(state: FriendsState): Friend | undefined {
        return state.all.find(f => {
            return f.activeChat === true
        })
    }

    friendExists(state: FriendsState, friend: Friend): Boolean {
        const search = state.all.find((fr: Friend) => fr.address === friend.address)
        return Boolean(search)
    }

    matchesActiveCall(state: any): Friend {
        return state.friends.all.find((friend: Friend) => friend.address === state.webrtc.activeCall)
    }

    matchesSomeActiveCall(state: any): Friend {
        return state.friends.all.some((friend: Friend) => friend.address === state.webrtc.activeCall)
    }
}