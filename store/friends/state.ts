import { FriendsState } from '~/store/friends/types'

const InitialFriendsState: FriendsState = {
  incomingRequests: [],
  outgoingRequests: [],
  all: [],
  activeConversation: null,
}

export default () => InitialFriendsState
