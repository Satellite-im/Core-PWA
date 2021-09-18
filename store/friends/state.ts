import { FriendsState } from '~/store/friends/types'

const InitalFriendsState: FriendsState = {
  incomingRequests: [],
  outgoingRequests: [],
  all: [],
}

export default () => InitalFriendsState
