import { NuxtState } from '@nuxt/types/app'
import { SearchResult } from '~/types/search/search'

const mutations = {
  search(state: NuxtState, results: SearchResult) {
    state.search = {
      ...state.search,
      results,
    }
  },
}

export default mutations
