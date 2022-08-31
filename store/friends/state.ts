import { FriendsState } from '~/store/friends/types'

const InitialFriendsState: FriendsState = {
  incomingRequests: [],
  outgoingRequests: [],
  all: [],
  activeConversation: undefined,
}

export default () => InitialFriendsState
