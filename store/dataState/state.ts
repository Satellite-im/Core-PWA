import { DataState, DataStateType } from './types'

const InitialDataState = (): DataState => ({
  files: DataStateType.Empty,
  friends: DataStateType.Empty,
  search: DataStateType.Empty,
})

export default InitialDataState
