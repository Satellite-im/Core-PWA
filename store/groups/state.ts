import { GroupsState } from '~/store/groups/types'

const InitialGroupsState: GroupsState = {
  all: [],
  inviteSubscription: null,
  groupSubscriptions: [],
}

export default () => InitialGroupsState
