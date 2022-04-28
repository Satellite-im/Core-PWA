import InitialTextileState from '~/store/textile/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialTextileState()
  })

  it('should return the initial settings state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
