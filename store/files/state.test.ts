import InitialFilesState from './state'

describe('Test files/state', () => {
  test('the function should match the initial state snapshot', () => {
    expect(InitialFilesState()).toMatchSnapshot()
  })
})
