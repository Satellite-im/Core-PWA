import { GroupsState } from '~/store/groups/types'

const InitialGroupsState: GroupsState = {
  all: [],
  subscriptionId: null,
}

export default () => InitialGroupsState
