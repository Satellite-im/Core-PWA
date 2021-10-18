import { SearchState } from './types'
import { SearchResult } from '~/types/search/search'

const mutations = {
  search(state: SearchState, result: SearchResult) {
    state.result = result
  },
  setSearchQuery(state: SearchState, query: string) {
    state.query = query
  },
}

export default mutations
