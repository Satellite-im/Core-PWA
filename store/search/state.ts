import { SearchResult } from '~/types/search/search'

interface SearchState {
  query: string
  result: SearchResult | null
}

const InitalSearchState = (): SearchState => ({
  query: '',
  result: null,
})

export default InitalSearchState
