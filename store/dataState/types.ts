export enum DataStateType {
  Empty = 'E',
  Loading = 'L',
  Updating = 'U',
  Ready = 'R',
}

export interface DataState {
  files: DataStateType
  friends: DataStateType
  groups: DataStateType
  search: DataStateType
}
