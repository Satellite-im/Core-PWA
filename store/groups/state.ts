interface GroupsState {
  selectedGroup: String
}

const InitialGroupsState = (): GroupsState => ({
  selectedGroup: '',
})

export default InitialGroupsState
