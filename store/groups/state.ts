import { GroupMembers, GroupsState } from '~/store/groups/types'

const InitialGroupsState: GroupsState = {
  all: [],
  inviteSubscription: null,
  groupSubscriptions: [],
  members: {} as GroupMembers,
}

export default () => InitialGroupsState
