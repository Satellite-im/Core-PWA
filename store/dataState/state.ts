export enum DataStateType {
  Empty = 'E',
  Loading = 'L',
  Updating = 'U',
  Ready = 'R',
}
interface DataState {
  files: DataStateType
  friends: DataStateType
  search: DataStateType
}

const InitialDataState: DataState = {
  files: DataStateType.Empty,
  friends: DataStateType.Empty,
  search: DataStateType.Empty,
}

export default InitialDataState
