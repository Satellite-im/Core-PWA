import * as Media from '~/store/media/mutations'

describe('Mutate Media by setting', () => {
  let inst: any
  const state: any = {
    incomingCall: '0x0',
    activeCall: '1x1',
    streaming: false,
  }

  beforeEach(() => {
    inst = Media.default
  })

  it('should toggle media incoming call', () => {
    const localStateForUnitTest = { ...state }
    inst.toggleMediaIncomingCall(localStateForUnitTest, '0x1')

    expect(localStateForUnitTest).toMatchObject({
      incomingCall: '0x1',
    })
  })
})
