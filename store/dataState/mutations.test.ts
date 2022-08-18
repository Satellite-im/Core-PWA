import { expect } from '@jest/globals'
import mutations from '~/store/dataState/mutations'
import { DataStateType } from '~/store/dataState/types'

describe('init', () => {
  const InitialDataStateState = {
    files: DataStateType.Ready,
    friends: DataStateType.Ready,
    search: DataStateType.Ready,
    groups: DataStateType.Ready,
  }
  let inst: any

  beforeEach(() => {
    inst = mutations
  })

  it('should set dataState state', () => {
    inst.setDataState(InitialDataStateState, {
      key: 'files',
      value: DataStateType.Updating,
    })

    expect(InitialDataStateState).toEqual({
      files: DataStateType.Updating,
      friends: DataStateType.Ready,
      search: DataStateType.Ready,
      groups: DataStateType.Ready,
    })
  })
})
