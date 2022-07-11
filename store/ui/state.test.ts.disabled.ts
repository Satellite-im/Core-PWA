import InitialUIState from '~/store/ui/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialUIState()
  })

  it('should return the initial settings state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
