import { RootState } from '~/store/store.types'
import { Friend, IncomingRequest, OutgoingRequest } from '~/types/ui/friends'

const mutations = {
  setIncomingRequests(state: RootState, incomingRequests: IncomingRequest[]) {
    state.friends.incomingRequests = incomingRequests
  },
  addIncomingRequest(state: RootState, incomingRequest: IncomingRequest) {
    state.friends.incomingRequests.push(incomingRequest)
  },
  updateIncomingRequest(state: RootState, incomingRequest: IncomingRequest) {
    state.friends.incomingRequests = state.friends.incomingRequests.map(
      (request) =>
        request.requestId !== incomingRequest.requestId
          ? request
          : incomingRequest
    )
  },
  removeIncomingRequest(state: RootState, requestId: string) {
    state.friends.incomingRequests = state.friends.incomingRequests.filter(
      (request) => request.requestId !== requestId
    )
  },
  setOutgoingRequests(state: RootState, outgoingRequests: OutgoingRequest[]) {
    state.friends.outgoingRequests = outgoingRequests
  },
  addOutgoingRequest(state: RootState, outgoingRequest: OutgoingRequest) {
    state.friends.outgoingRequests.push(outgoingRequest)
  },
  updateOutgoingRequest(state: RootState, outgoingRequest: OutgoingRequest) {
    state.friends.outgoingRequests = state.friends.outgoingRequests.map(
      (request) =>
        request.requestId !== outgoingRequest.requestId
          ? request
          : outgoingRequest
    )
  },
  removeOutgoingRequest(state: RootState, requestId: string) {
    state.friends.outgoingRequests = state.friends.outgoingRequests.filter(
      (request) => request.requestId !== requestId
    )
  },
  addFriend(state: RootState, friend: Friend) {
    state.friends.all.push(friend)
  },
  updateFriend(state: RootState, friend: Friend) {
    state.friends.all = state.friends.all.map((fr) =>
      fr.publicKey === friend.publicKey ? friend : fr
    )
  },
  removeFriend(state: RootState, friendPublicKey: string) {
    state.friends.all = state.friends.all.filter(
      (fr) => fr.publicKey !== friendPublicKey
    )
  },
}

export default mutations
