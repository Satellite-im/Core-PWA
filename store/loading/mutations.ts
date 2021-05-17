import { NuxtState } from '@nuxt/types/app'

const mutations = {
  load(state: NuxtState, key: string) {
    state.loading = {
      ...state.loading,
      [key]: true,
    }
  },
}

export default mutations
