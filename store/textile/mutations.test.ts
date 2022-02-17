import mutations from '~/store/textile/mutations'
import InitialTextileState from '~/store/textile/state'

describe('init', () => {
  let inst: any

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
          imageMessage: '',
          textMessage: '',
          mediaMessage: '',
          glyphMessage: '',
        },
        {
          replyMessage: 'text1',
          reactionMessage: '',
          fileMessage: '',
          imageMessage: '',
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
  it('should resetConversation', () => {
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
  it('should addMessageToConversation', () => {
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
        replyMessage: 'text',
        reactionMessage: '',
        fileMessage: '',
        imageMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
      },
    }
    inst.addMessageToConversation(localState, newMessage)

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
  it('should clearUploadProgress', () => {
    const localState = InitialTextileState()
    localState.uploadProgress = {
      'file.jpeg': {
        progress: 42,
        finished: false,
        name: 'file.jpeg',
      },
    }
    inst.clearUploadProgress(localState)

    expect(localState.uploadProgress).toMatchObject({})
  })
  it('should setUploadingFileProgress to 100', () => {
    const localState = InitialTextileState()
    localState.uploadProgress = {
      'file.jpeg': {
        progress: 42,
        finished: false,
        name: 'file.jpeg',
      },
    }
    const newFileProgressState = {
      progress: 100,
      name: 'file.jpeg',
    }
    inst.setUploadingFileProgress(localState, newFileProgressState)

    expect(localState.uploadProgress[newFileProgressState.name]).toMatchObject({
      finished: true,
    })
  })
  it('should setUploadingFileProgress to 90', () => {
    const localState = InitialTextileState()
    localState.uploadProgress = {
      'file.jpeg': {
        progress: 42,
        finished: false,
        name: 'file.jpeg',
      },
    }
    const newFileProgressState = {
      progress: 90,
      name: 'file.jpeg',
    }
    inst.setUploadingFileProgress(localState, newFileProgressState)

    expect(localState.uploadProgress[newFileProgressState.name]).toMatchObject({
      finished: false,
    })
  })
})
