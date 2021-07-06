import { Friend } from '~/types/ui/core'

interface FriendsState {
  all: Array<Friend>
}

const InitalFriendsState: FriendsState = {
  all: [],
}

export default InitalFriendsState
