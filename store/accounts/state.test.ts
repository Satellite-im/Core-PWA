import InitialAccountsState from '~/store/accounts/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialAccountsState()
  })

  it('should return the initial settings state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
