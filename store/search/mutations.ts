import { NuxtState } from '@nuxt/types/app'
import { SearchResult } from '~/types/search/search'

const mutations = {
  search(state: NuxtState, result: SearchResult) {
    state.search = {
      ...state.search,
      result,
    }
  },
  setSearchQuery(state: NuxtState, query: string) {
    state.search = {
      ...state.search,
      query,
    }
  },
}

export default mutations
