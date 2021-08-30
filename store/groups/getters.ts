import { NuxtState } from '@nuxt/types/app'
import { GetterTree } from 'vuex'

const getters: GetterTree<NuxtState, NuxtState> = {
  getSelectedGroup: (state, getters, rootState) =>
    rootState.groups.selectedGroup,
}

export default getters
