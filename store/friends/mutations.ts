import { Conversation } from '../textile/types'
import { FriendsState } from './types'
import { Friend, IncomingRequest, OutgoingRequest } from '~/types/ui/friends'

const mutations = {
  setIncomingRequests(
    state: FriendsState,
    incomingRequests: IncomingRequest[],
  ) {
    state.incomingRequests = incomingRequests
  },
  addIncomingRequest(state: FriendsState, incomingRequest: IncomingRequest) {
    state.incomingRequests.push(incomingRequest)
  },
  updateIncomingRequest(state: FriendsState, incomingRequest: IncomingRequest) {
    state.incomingRequests = state.incomingRequests.map((request) =>
      request.requestId !== incomingRequest.requestId
        ? request
        : incomingRequest,
    )
  },
  removeIncomingRequest(state: FriendsState, requestId: string) {
    state.incomingRequests = state.incomingRequests.filter(
      (request) => request.requestId !== requestId,
    )
  },
  setOutgoingRequests(
    state: FriendsState,
    outgoingRequests: OutgoingRequest[],
  ) {
    state.outgoingRequests = outgoingRequests
  },
  addOutgoingRequest(state: FriendsState, outgoingRequest: OutgoingRequest) {
    state.outgoingRequests.push(outgoingRequest)
  },
  updateOutgoingRequest(state: FriendsState, outgoingRequest: OutgoingRequest) {
    state.outgoingRequests = state.outgoingRequests.map((request) =>
      request.requestId !== outgoingRequest.requestId
        ? request
        : outgoingRequest,
    )
  },
  removeOutgoingRequest(state: FriendsState, requestId: string) {
    state.outgoingRequests = state.outgoingRequests.filter(
      (request) => request.requestId !== requestId,
    )
  },
  addFriend(state: FriendsState, friend: Friend) {
    state.all.push(friend)
  },
  setActive(state: FriendsState, friend: Friend) {
    state.all = state.all.map((f) => ({
      ...f,
      activeChat: f.address === friend.address,
    }))
  },
  setStored(state: FriendsState, friend: Friend, isStored: boolean = true) {
    state.all = state.all.map((f) => ({
      ...f,
      stored: f.address === friend.address ? isStored : f.stored,
    }))
  },
  setTyping(
    state: FriendsState,
    opts: { id: string; typingState: 'TYPING' | 'NOT_TYPING' },
  ) {
    state.all = state.all.map((f) => ({
      ...f,
      typingState:
        f.address === opts.id
          ? opts.typingState
          : f.typingState || 'NOT_TYPING',
    }))
  },
  setNote(
    state: FriendsState,
    opts: {
      id: string
      note: string
    },
  ) {
    state.all = state.all.map((fr) =>
      fr.address === opts.id
        ? {
            ...fr,
            note: opts.note,
          }
        : fr,
    )
  },
  updateFriend(state: FriendsState, friend: Friend) {
    state.all = state.all.map(
      (fr) => (fr = fr.address === friend.address ? { ...fr, ...friend } : fr),
    )
  },
  removeFriend(state: FriendsState, accountAddress: string) {
    state.all = state.all.filter((fr) => fr.address !== accountAddress)
  },
  sortFriends(state: FriendsState, rConversations: Conversation) {
    state.all = state.all
      .map((user) => {
        const conversation = rConversations[user.address]
        user.lastUpdate = conversation?.lastUpdate || 0
        return user
      })
      .sort((user1, user2) => user2.lastUpdate - user1.lastUpdate)
  },
}

export default mutations
