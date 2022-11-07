import InitialChatState from './state'
import { ChatFileUpload } from './types'
import * as module from '~/store/chat/mutations'

describe('misc', () => {
  const object2: any = [
    { userId: '12345', value: 'Dillenberg' },
    { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
    { userId: '12345', value: 'elio@example.com' },
    { userId: '9876', value: 'elio@example.com' },
  ]
  const object: any = [
    { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
    { replyId: '12345', value: false },
  ]
  const object3: ChatFileUpload[] = []
  const state = { replies: object, chatTexts: object2, files: object3 }

  test('module.default.addFile with empty files array', () => {
    const obj = {
      file: {
        file: 'path2',
        url: 'string2',
        nsfw: {
          checking: false,
          status: false,
        },
      },
      address: 'address1',
    }
    module.default.addFile(state, obj)
    expect(state.files).toMatchSnapshot()
  })

  test('module.default.addFile with existing files array', () => {
    const obj = {
      file: {
        file: 'path2',
        url: 'string2',
        nsfw: {
          checking: false,
          status: false,
        },
      },
      address: 'address1',
    }
    module.default.addFile(state, obj)
    const obj2 = {
      file: {
        file: 'path3',
        url: 'string3',
        nsfw: {
          checking: false,
          status: false,
        },
      },
      address: 'address1',
    }
    module.default.addFile(state, obj2)
    expect(state.files).toMatchSnapshot()
  })
})

describe('misc', () => {
  test('module.removeFile', () => {
    const localState = {
      ...InitialChatState,
      files: {
        file1: [
          {
            file: 'path2',
            url: 'string2',
            nsfw: {
              checking: false,
              status: false,
            },
            progress: 0,
          },
        ],
      },
    }
    const argument = { id: 'file1', index: 0 }

    module.default.removeFile(localState, argument)

    expect(localState.files).toEqual({ file1: [] })
  })

  // test('module.setFileProgress', () => {
  //   const localState = {
  //     ...InitialChatState,
  //     files: {
  //       file1: [
  //         {
  //           file: 'path2',
  //           url: 'string2',
  //           nsfw: {
  //             checking: false,
  //             status: false,
  //           },
  //           progress: 0,
  //         },
  //       ],
  //     },
  //   }
  //   const argument = { id: 'file1', index: 0, progress: 10 }

  //   module.default.setFileProgress(localState, argument)

  //   expect(localState.files).toEqual({
  //     file1: [
  //       {
  //         file: 'path2',
  //         nsfw: { checking: false, status: false },
  //         progress: 10,
  //         url: 'string2',
  //       },
  //     ],
  //   })
  // })

  test('module.default.deleteFiles', () => {
    const state = {
      ...InitialChatState,
      files: {
        file1: [
          {
            file: 'path2',
            url: 'string2',
            nsfw: {
              checking: false,
              status: false,
            },
            progress: 0,
          },
        ],
      },
    }

    module.default.deleteFiles(state, 'file1')
    expect(state.files).toEqual({})
  })

  test('module.default.setDraftMessage', () => {
    const state = {
      ...InitialChatState,
      draftMessages: {
        conversation_id: 'no_message',
      },
    }
    const argument = {
      conversationId: 'conversation_id',
      message: 'message',
    }

    module.default.setDraftMessage(state, argument)
    expect(state.draftMessages[argument.conversationId]).toBe(argument.message)
  })

  test('module.default.clearReplyChatbarMessage', () => {
    const state = {
      ...InitialChatState,
      replyChatbarMessages: {
        conversation_id: 'no_message',
      },
    }
    const argument = {
      conversationId: 'conversation_id',
      message: 'message',
    }

    module.default.clearReplyChatbarMessage(state, argument)
    expect(state.replyChatbarMessages).toEqual({})
  })

  test('module.default.setReplyChatbarMessage', () => {
    const state = {
      ...InitialChatState,
      replyChatbarMessages: {
        conversation_id: 'no_message',
      },
    }
    const argument = {
      conversationId: 'conversation_id',
      message: 'message',
    }

    module.default.setReplyChatbarMessage(state, argument)
    expect(state.replyChatbarMessages[argument.conversationId]).toBe(
      argument.message,
    )
  })

  test('module.default.setActiveUploadChat', () => {
    const state = InitialChatState()
    const argument = 'conversation_id'

    module.default.setActiveUploadChat(state, argument)
    expect(state.activeUploadChats).toEqual([argument])
  })

  test('module.default.setActiveUploadChat for more than two calls', () => {
    const state = InitialChatState()

    const initialArgument = 'conversation_id'
    module.default.setActiveUploadChat(state, initialArgument)

    const secondaryArgument = 'conversation_id'
    module.default.setActiveUploadChat(state, secondaryArgument)

    expect(state.activeUploadChats).toEqual([
      initialArgument,
      secondaryArgument,
    ])
  })

  test('module.default.removeActiveUploadChat', () => {
    const state = InitialChatState()
    const argument = 'conversation_id'

    module.default.setActiveUploadChat(state, argument)
    expect(state.activeUploadChats).toEqual([argument])
    module.default.removeActiveUploadChat(state, argument)
    expect(state.activeUploadChats).toEqual([])
  })

  test('module.default.setEnhancersRoute', () => {
    const state = InitialChatState()
    const argument = 'emoji'

    module.default.setEnhancersRoute(state, argument)
    expect(state.enhancersRoute).toEqual(argument)
  })

  test('module.default.setMessageReaction', () => {
    const state = InitialChatState()
    const argument = {
      messageId: 'message',
      conversationId: 'conversation',
    }

    module.default.setMessageReaction(state, argument)
    expect(state.messageReaction).toEqual({
      conversationId: 'conversation',
      messageId: 'message',
    })
  })

  test('module.default.removeActiveUploadChat for more than two calls', () => {
    const state = InitialChatState()

    const initialArgument = 'conversation_id'
    module.default.setActiveUploadChat(state, initialArgument)

    const secondaryArgument = 'conversation_id'
    module.default.setActiveUploadChat(state, secondaryArgument)

    expect(state.activeUploadChats).toEqual([
      initialArgument,
      secondaryArgument,
    ])

    module.default.removeActiveUploadChat(state, initialArgument)

    expect(state.activeUploadChats).toEqual([initialArgument])

    module.default.removeActiveUploadChat(state, secondaryArgument)

    expect(state.activeUploadChats).toEqual([])
  })
})
