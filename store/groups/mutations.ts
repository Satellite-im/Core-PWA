import { NuxtState } from '@nuxt/types/app'

export default {
  setSelectedGroup(state: NuxtState, address: String) {
    state.groups.selectedGroup = address
  },
}
