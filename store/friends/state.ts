import { FriendsState, FriendsTabs } from '~/store/friends/types'

const InitialFriendsState: FriendsState = {
  incomingRequests: [],
  outgoingRequests: [],
  all: [],
  activeConversation: undefined,
  activeTab: FriendsTabs.Add,
}

export default () => InitialFriendsState
