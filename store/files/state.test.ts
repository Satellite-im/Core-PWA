import InitialFilesState from './state'

describe('Test files/state', () => {
  it('should match the initial state snapshot', () => {
    expect(InitialFilesState).toMatchSnapshot()
  })

  test('the function should match the initial state snapshot', () => {
    expect(InitialFilesState()).toMatchSnapshot()
  })
})
