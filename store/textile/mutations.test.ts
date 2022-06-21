import 'fake-indexeddb/auto'
import db from '~/libraries/SatelliteDB/SatelliteDB'
import mutations from '~/store/textile/mutations'
import InitialTextileState from '~/store/textile/state'

describe('init', () => {
  let inst: any

  beforeAll(async () => {
    await db.initializeSearchIndexes()
  })

  beforeEach(() => {
    inst = mutations
  })

  it('should initialize textile', () => {
    const localState = InitialTextileState()
    inst.textileInitialized(localState, true)

    expect(localState.initialized).toBeTruthy()
  })
  it('should setConversation', () => {
    const localState = InitialTextileState()
    localState.conversations = {
      '0x0': {
        messages: {},
        replies: {},
        reactions: {},
        lastInbound: 123,
        lastUpdate: 120,
        limit: 1,
        skip: 1,
        end: false,
      },
      '0x9': {
        messages: {},
        replies: {},
        reactions: {},
        lastInbound: 123,
        lastUpdate: 120,
        limit: 1,
        skip: 1,
        end: false,
      },
    }
    const newMessage = {
      address: '0x0',
      sender: '0x1',
      messages: [
        {
          replyMessage: 'text0',
          reactionMessage: '',
          fileMessage: '',
          textMessage: '',
          mediaMessage: '',
          glyphMessage: '',
        },
        {
          replyMessage: 'text1',
          reactionMessage: '',
          fileMessage: '',
          textMessage: '',
          mediaMessage: '',
          glyphMessage: '',
        },
      ],
      limit: 123,
      skip: 120,
      end: false,
    }
    inst.setConversation(localState, newMessage)

    const newObject = {
      end: false,
      lastInbound: 123,
      lastUpdate: 120,
      limit: 123,
      messages: {},
      reactions: {},
      replies: {},
      skip: 120,
    }

    expect(localState.conversations).toMatchObject({
      [newMessage.address]: newObject,
    })
  })
  it('should resetConversation', async () => {
    const localState = InitialTextileState()
    await db.initializeSearchIndexes()
    localState.conversations = {
      '0x0': {
        messages: {},
        replies: {},
        reactions: {},
        lastInbound: 123,
        lastUpdate: 120,
        limit: 1,
        skip: 1,
        end: false,
      },
      '0x9': {
        messages: {},
        replies: {},
        reactions: {},
        lastInbound: 123,
        lastUpdate: 120,
        limit: 1,
        skip: 1,
        end: false,
      },
    }
    const newMessage = {
      address: '0x0',
    }
    inst.resetConversation(localState, newMessage)

    const newObject = {
      end: false,
      lastInbound: undefined,
      lastUpdate: undefined,
      limit: 1,
      messages: {},
      reactions: {},
      replies: {},
      skip: 1,
    }

    expect(localState.conversations).not.toMatchObject({
      [newMessage.address]: newObject,
    })
  })
  it('should addMessageToConversation', async () => {
    const localState = InitialTextileState()
    localState.conversations = {
      '0x0': {
        messages: {},
        replies: {},
        reactions: {},
        lastInbound: 123,
        lastUpdate: 120,
        limit: 1,
        skip: 1,
        end: false,
      },
      '0x9': {
        messages: {},
        replies: {},
        reactions: {},
        lastInbound: 123,
        lastUpdate: 120,
        limit: 1,
        skip: 1,
        end: false,
      },
    }
    const newMessage = {
      address: '0x0',
      sender: '0x1',
      message: {
        id: '0x1',
        from: '0x1',
        to: '0x0',
        payload: 'hello, world',
        type: 'text',
        at: 123,
        readAt: 123,
      },
    }
    inst.addMessageToConversation(localState, newMessage)

    const newObject = {
      end: false,
      lastInbound: 123,
      lastUpdate: 123,
      limit: 1,
      messages: {},
      reactions: {},
      replies: {},
      skip: 1,
    }

    expect(localState.conversations).toMatchObject({
      [newMessage.address]: newObject,
    })
  })
  it('should setConversationLoading', () => {
    const localState = InitialTextileState()
    const newLoadingState = {
      loading: false,
    }
    inst.setConversationLoading(localState, newLoadingState)

    expect(localState).toMatchObject({
      conversationLoading: false,
    })
  })
  it('should setMessageLoading', () => {
    const localState = InitialTextileState()
    const newLoadingState = {
      loading: false,
    }
    inst.setMessageLoading(localState, newLoadingState)

    expect(localState).toMatchObject({
      messageLoading: false,
    })
  })
  it('should setActiveConversation to a specific address', () => {
    const localState = InitialTextileState()
    const testAddress = '0xadress'
    inst.setActiveConversation(localState, testAddress)

    expect(localState.activeConversation).toBe(testAddress)
  })
  it('should setUserThreadData', () => {
    const localState = InitialTextileState()
    const argument = {
      _id: 'Corrupti similique doloribus sed similique. Est esse eveniet impedit soluta dignissimos. Facere aut voluptatibus. Itaque recusandae occaecati.\n \rArchitecto cum modi dolor ut aut. Et iusto pariatur quia ratione quos vero nihil. Atque optio dolorum vitae incidunt molestiae. Explicabo odio iste consectetur totam dolore aut nihil fuga velit.\n \rQuidem maiores inventore laborum facere est quibusdam ea. Ut ullam illum sed consequatur odio vel deserunt est. Non et officiis quod illo voluptates quos repudiandae. Aperiam ipsam autem in rem odit laudantium quasi et adipisci. Dolorem delectus facilis non enim eaque atque cupiditate.',
      consentToScan: false,
      blockNsfw: true,
      flipVideo: true,
    }
    inst.setUserThreadData(localState, argument)

    expect(localState.userThread).toMatchObject(argument)
  })
})
