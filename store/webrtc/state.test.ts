import InitialWebRTCState from '~/store/webrtc/state'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = InitialWebRTCState()
  })

  it('should return the initial settings state', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the initial settings state', () => {
    expect(inst).not.toEqual({})
  })
})
