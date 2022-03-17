import { DataStateType } from '~/store/dataState/types'
import * as actions from '~/store/files/actions'

describe('actions.default.handler', () => {
  test('0', () => {
    const result: any = actions.default.handler()
    expect(result).toMatchSnapshot()
  })
})
describe('actions.default.fetchFiles', () => {
  test('file state empty', async () => {
    const commit = jest.fn()
    const rootState: any = {
      dataState: {
        files: DataStateType.Empty,
      },
    }

    await actions.default.fetchFiles({ commit, rootState })

    expect(commit).toHaveBeenCalledWith(
      'dataState/setDataState',
      { key: 'files', value: DataStateType.Loading },
      { root: true },
    )
  })
  test('file state loading', async () => {
    const commit = jest.fn()
    const rootState: any = {
      dataState: {
        files: DataStateType.Loading,
      },
    }

    await actions.default.fetchFiles({ commit, rootState })

    expect(commit).not.toHaveBeenCalled()
  })
  test('file state ready', async () => {
    // In order to trigger the last condition (else), we cannot use ones that have been covered (Empty, Loading, Updating); hence we used Ready for the DataStateType.
    const commit = jest.fn()
    const rootState: any = {
      dataState: {
        files: DataStateType.Ready,
      },
    }

    await actions.default.fetchFiles({ commit, rootState })

    expect(commit).toHaveBeenCalledWith(
      'dataState/setDataState',
      { key: 'files', value: DataStateType.Updating },
      { root: true },
    )
  })
})
