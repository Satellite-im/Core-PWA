import { SearchState } from './types'

const InitalSearchState = (): SearchState => ({
  query: '',
  result: null,
})

export default InitalSearchState
