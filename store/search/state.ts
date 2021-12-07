import { SearchState } from './types'

const InitialSearchState = (): SearchState => ({
  query: '',
  result: null,
})

export default InitialSearchState
