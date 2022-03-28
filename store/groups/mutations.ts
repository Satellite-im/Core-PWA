import { GroupsState, Group, GroupMember } from './types'

const mutations = {
  setGroups(state: GroupsState, groups: Group[]) {
    state.all = groups
  },
  addGroup(state: GroupsState, group: Group) {
    state.all.push(group)
  },
  updateGroup(state: GroupsState, group: Group) {
    state.all = state.all.map((item) =>
      item.id !== group.id ? item : { ...item, ...group },
    )
  },
  setInviteSubscription(state: GroupsState, value: number | null) {
    state.inviteSubscription = value
  },
  setGroupSubscriptions(state: GroupsState, value: string[]) {
    state.groupSubscriptions = value
  },
  addGroupSubscription(state: GroupsState, value: string) {
    state.groupSubscriptions.push(value)
  },
  setGroupMembers(
    state: GroupsState,
    { groupId, members }: { groupId: string; members: GroupMember[] },
  ) {
    state.members[groupId] = members
  },
}

export default mutations
