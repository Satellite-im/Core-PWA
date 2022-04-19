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

describe('getters.default.getInitialized', () => {
  test('0', () => {
    const result: any = getters.default.getInitialized({
      initialized: true,
      activeConversation: 'da7588892',
      conversations: {},
      conversationLoading: true,
      messageLoading: false,
      uploadProgress: {
        key0: { progress: 300, finished: false, name: 'Pierre Edouard' },
        key1: { progress: 0.0, finished: true, name: 'Michael' },
        key2: { progress: 0.0, finished: true, name: 'Jean-Philippe' },
      },
    })
    expect(result).toMatchSnapshot()
  })
})

describe('getters.default.getConversationMessages', () => {
  test('0', () => {
    const result: any = getters.default.getConversationMessages({
      initialized: true,
      activeConversation: '',
      conversations: {},
      conversationLoading: false,
      messageLoading: false,
      uploadProgress: {
        key0: { progress: NaN, finished: false, name: '' },
        key1: { progress: NaN, finished: false, name: '' },
        key2: { progress: NaN, finished: true, name: '' },
      },
    })
    expect(result).toMatchSnapshot()
  })
})

describe('getters.default.getConversation', () => {
  test('0', () => {
    const result: any = getters.default.getConversation({
      initialized: true,
      activeConversation: '9876',
      conversations: {},
      conversationLoading: false,
      messageLoading: true,
      uploadProgress: {},
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = getters.default.getConversation({
      initialized: false,
      activeConversation: 'bc23a9d531064583ace8f67dad60f6bb',
      conversations: {},
      conversationLoading: true,
      messageLoading: false,
      uploadProgress: {},
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = getters.default.getConversation({
      initialized: false,
      activeConversation: '',
      conversations: {},
      conversationLoading: true,
      messageLoading: true,
      uploadProgress: {},
    })
    expect(result).toMatchSnapshot()
  })
})
