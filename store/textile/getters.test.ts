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

describe('getters.default.getConversation', () => {
  test('0', () => {
    const localState = {
      initialized: true,
      activeConversation: '9876',
      conversations: {
        key0: {
          messages: [
            {
              '01g12df0ey85k9905f85yj4c9c': {
                from: 'bbaareibupvl76qkt2n3y7hlj7qmjmogtaw7eaaroj2bdlaao6dxet46bge',
                to: 'bbaareidn44vnowdx6y4xfm7ypjh4zjm45qdrdb42uqg25jxtkv3ru2wqdq',
                at: 1650422415838,
                type: 'text',
                payload: 'hey',
                id: '01g12df0ey85k9905f85yj4c9c',
                readAt: 0,
                conversation: 'DA1kvHx1wXX3xLGwkX8in3DKoDcXqWJ9TtdvJJRuz41W',
              },
            },
          ],
          replies: [],
          reactions: [],
          lastInbound: 1650422415838,
          lastUpdate: 1650504356737,
          lastMessage: {
            conversation: 'DA1kvHx1wXX3xLGwkX8in3DKoDcXqWJ9TtdvJJRuz41W',
            from: 'bbaareidn44vnowdx6y4xfm7ypjh4zjm45qdrdb42uqg25jxtkv3ru2wqdq',
            to: 'bbaareibupvl76qkt2n3y7hlj7qmjmogtaw7eaaroj2bdlaao6dxet46bge',
            at: 1650504356737,
            type: 'glyph',
            payload:
              'https://satellite.mypinata.cloud/ipfs/QmRwZDz8qavwCcmq6DSDTDLrt1qzzw2nMcz1pcGuNxdhcW/$1/Sad3.gif',
            pack: 'Astrobunny',
            id: '01g14vkmw10bj09n45630t6m6a',
          },
          limit: 50,
          skip: 0,
        },
      },
      conversationLoading: false,
      messageLoading: true,
      uploadProgress: {},
    }
    const result: any = getters.default.getConversation(localState)
    expect(result()).toBeNull()
  })
})

describe('getters.default.getConversationMessages', () => {
  test('0', () => {
    const localState = {
      initialized: true,
      activeConversation: '9876',
      conversations: {
        key0: {
          messages: [
            {
              '01g12df0ey85k9905f85yj4c9c': {
                from: 'bbaareibupvl76qkt2n3y7hlj7qmjmogtaw7eaaroj2bdlaao6dxet46bge',
                to: 'bbaareidn44vnowdx6y4xfm7ypjh4zjm45qdrdb42uqg25jxtkv3ru2wqdq',
                at: 1650422415838,
                type: 'text',
                payload: 'hey',
                id: '01g12df0ey85k9905f85yj4c9c',
                readAt: 0,
                conversation: 'DA1kvHx1wXX3xLGwkX8in3DKoDcXqWJ9TtdvJJRuz41W',
              },
            },
          ],
          replies: [],
          reactions: [],
          lastInbound: 1650422415838,
          lastUpdate: 1650504356737,
          lastMessage: {
            conversation: 'DA1kvHx1wXX3xLGwkX8in3DKoDcXqWJ9TtdvJJRuz41W',
            from: 'bbaareidn44vnowdx6y4xfm7ypjh4zjm45qdrdb42uqg25jxtkv3ru2wqdq',
            to: 'bbaareibupvl76qkt2n3y7hlj7qmjmogtaw7eaaroj2bdlaao6dxet46bge',
            at: 1650504356737,
            type: 'glyph',
            payload:
              'https://satellite.mypinata.cloud/ipfs/QmRwZDz8qavwCcmq6DSDTDLrt1qzzw2nMcz1pcGuNxdhcW/$1/Sad3.gif',
            pack: 'Astrobunny',
            id: '01g14vkmw10bj09n45630t6m6a',
          },
          limit: 50,
          skip: 0,
        },
      },
      conversationLoading: false,
      messageLoading: true,
      uploadProgress: {},
    }
    const result: any = getters.default.getConversationMessages(localState)
    expect(result()).toEqual([])
  })
})
