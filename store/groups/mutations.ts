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
    const group = state.all.find((g) => g.id === groupId)
    if (group) {
      group.members = members.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  setGroupsLastUpdate(state: GroupsState, payload: { [key: string]: number }) {
    state.all = state.all.map((group) => ({
      ...group,
      lastUpdate: payload[group.id],
    }))
  },
}

export default mutations
