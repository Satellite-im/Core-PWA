import { DataState, DataStateType } from './types'
const mutations = {
  setDataState(
    state: DataState,
    { key, value }: { key: keyof DataState; value: DataStateType },
  ) {
    state[key] = value
  },
}

export default mutations
