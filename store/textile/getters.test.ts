import * as getters from '~/store/textile/getters'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = getters.default
  })

  it('should return the initialized variable of the state', () => {
    const result: any = inst.getInitialized({
      initialized: false,
      conversations: {},
      conversationLoading: false,
      messageLoading: false,
      uploadProgress: {},
    })
    expect(result).toMatchSnapshot()
  })

  it('should not return the initialized variable of the state', () => {
    // An error will be thrown because the arguments passed into the constructor is not proper
    const result: any = inst.getInitialized({})
    expect(result).not.toEqual({})
  })
})
