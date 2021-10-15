import { SearchResult } from '~/types/search/search'

export interface SearchState {
  query: string
  result: SearchResult | null
}
