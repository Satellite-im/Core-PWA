import { GroupsState, Group, GroupMemberInfo } from './types'

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
  setSubscriptionId(state: GroupsState, value: number | null) {
    state.subscriptionId = value
  },
  setGroupMembersInfo(
    state: GroupsState,
    {
      groupId,
      info,
      addresses,
    }: { groupId: string; info: GroupMemberInfo[]; addresses: string[] },
  ) {
    state.all = state.all.map((item) =>
      item.id !== groupId ? item : { ...item, membersInfo: info, addresses },
    )
  },
}

export default mutations
