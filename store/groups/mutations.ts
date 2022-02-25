import { GroupsState, Group } from './types'

const mutations = {
  setGroups(state: GroupsState, groups: Group[]) {
    console.log('setGroups', groups)
    state.all = groups
  },
  addGroup(state: GroupsState, group: Group) {
    state.all.push(group)
  },
  updateGroup(state: GroupsState, group: Group) {
    state.all = state.all.map((item) => (item.id !== group.id ? item : group))
  },
}

export default mutations
