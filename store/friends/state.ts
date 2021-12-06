import { FriendsState } from '~/store/friends/types'

const InitialFriendsState: FriendsState = {
  incomingRequests: [],
  outgoingRequests: [],
  all: [],
}

export default () => InitialFriendsState
