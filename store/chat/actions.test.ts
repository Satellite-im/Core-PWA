import { RegistrationStatus } from '~/store/accounts/types'
import * as actions from '~/store/chat/actions'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { UploadDropItemType } from '~/types/files/file'
import { RootState } from '~/types/store/store'
import { ScrollDirections } from '~/types/chat/chat'
import {
  ConversationActivity,
  ConversationConnection,
} from '~/store/conversation/types'

describe('actions.default.setChatText', () => {
  test('0', async () => {
    const commit = jest.fn()
    const request = {
      userId: 'quidem animi delectus',
      value:
        'In aut ducimus eius ut. Commodi id numquam et tempora officiis aut neque qui necessitatibus. Asperiores ea temporibus et eum facere illum consequatur.',
    }

    await actions.default.setChatText({ commit }, request)
    expect(commit).toBeCalledWith('chatText', request)
  })
})

describe('actions.default.removeUploadItem', () => {
  test('remove upload item when files length is not only one', async () => {
    const object: any = [
      { replyId: 'c466a48309794261b64a4f02cfcc3d64', value: false },
      { replyId: '12345', value: false },
    ]
    const object2: any = [
      { userId: '12345', value: 'Dillenberg' },
      { userId: 'bc23a9d531064583ace8f67dad60f6bb', value: 'Dillenberg' },
      { userId: '12345', value: 'elio@example.com' },
      { userId: '9876', value: 'elio@example.com' },
    ]
    const object3: UploadDropItemType[] = [
      {
        file: 'path_file_0',
        nsfw: { checking: false, status: false },
        url: 'string',
      },
      {
        file: 'path_file_1',
        nsfw: { checking: false, status: false },
        url: 'string1',
      },
    ]
    const state = { replies: object, chatTexts: object2, files: object3 }
    const commit = jest.fn()
    const request = {
      itemIndex: 1,
      files: [
        {
          file: 'path_file_0',
          nsfw: { checking: false, status: false },
          url: 'string',
        },
        {
          file: 'path_file_1',
          nsfw: { checking: false, status: false },
          url: 'string1',
        },
      ],
      recipientAddress: 'bc23a9d531064583ace8f67dad60f6bb',
    }

    await actions.default.removeUploadItem({ commit }, state, request)
    expect(commit).toBeCalledWith('setFiles', {
      files: [
        {
          file: 'path_file_0',
          nsfw: { checking: false, status: false },
          url: 'string',
        },
        {
          file: 'path_file_1',
          nsfw: { checking: false, status: false },
          url: 'string1',
        },
      ],
    })
  })
  test('remove upload item when files length is only one', async () => {
    const rootState: RootState = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'true',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        registrationStatus: RegistrationStatus.IN_PROGRESS,
        lastVisited: '',
      },
      dataState: {
        files: DataStateType.Empty,
        friends: DataStateType.Loading,
        search: DataStateType.Ready,
      },
      friends: {
        incomingRequests: [
          {
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
            from: '',
            userInfo: {
              name: '',
              servers: {},
              status: '',
              photoHash: '',
            },
          },
        ],
        outgoingRequests: [
          {
            to: '',
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
          },
        ],
        all: [
          {
            publicKey: 'NoWiFi4you',
            typingState: 'NOT_TYPING',
            item: {},
            pending: true,
            activeChat: true,
            encryptedTextilePubkey: '',
            name: 'Taurus Nix',
            address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
            account: {
              accountId: 'Checking Account',
              from: '.',
              status: 429,
              fromMailboxId: '12345',
              toMailboxId: 'v4.0.0-rc.4',
              to: './path/to/file',
            },
            textilePubkey:
              'https://accounts.google.com/o/oauth2/revoke?token=%s',
            status: '',
            state: 'idle',
            unreadCount: 123,
            profilePicture: '',
            badge: 'community',
            userAccount: '',
            mailboxId: '',
          },
        ],
      },
      textile: {
        initialized: true,
        conversations: {},
        conversationLoading: true,
        messageLoading: true,
        uploadProgress: {
          abc: {
            progress: 42,
            finished: false,
            name: 'file.pdf',
          },
        },
      },
      webrtc: {
        initialized: true,
        incomingCall: '',
        activeCall: '',
        connectedPeers: [],
        activeStream: {
          createdAt: 0,
        },
        streaming: true,
        localTracks: { audio: {}, video: {} },
        remoteTracks: { audio: {}, video: {} },
      },
      settings: {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: CaptureMouseTypes.always,
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 96000,
        sampleSize: 24,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          toggleMute: 'alt+m',
          toggleDeafen: 'alt+d',
          openSettings: 'alt+s',
          callActiveChat: 'alt+c',
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
    }
    const commit = jest.fn()
    const dispatch = jest.fn()
    const request = {
      itemIndex: 1,
      files: [
        {
          file: 'path_file_0',
          nsfw: { checking: false, status: false },
          url: 'string',
        },
      ],
      recipientAddress: 'bc23a9d531064583ace8f67dad60f6bb',
    }

    await actions.default.removeUploadItem(
      { commit, rootState, dispatch },
      request,
    )
    expect(commit).toBeCalledWith('setCountError', false)
    expect(commit).toBeCalledWith(
      'deleteFiles',
      'bc23a9d531064583ace8f67dad60f6bb',
    )
    expect(dispatch).toBeCalledWith('textile/clearUploadStatus')

    // Because rootState.textile.messageLoading is true, commit will be called with this.
    expect(commit).toBeCalledWith('textile/setMessageLoading', {
      loading: false,
    })
  })
  test('remove upload item when files length is only one but messageLoading is false', async () => {
    const rootState: RootState = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'true',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        registrationStatus: RegistrationStatus.IN_PROGRESS,
        lastVisited: '',
      },
      dataState: {
        files: DataStateType.Empty,
        friends: DataStateType.Loading,
        search: DataStateType.Ready,
      },
      friends: {
        incomingRequests: [
          {
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
            from: '',
            userInfo: {
              name: '',
              servers: {},
              status: '',
              photoHash: '',
            },
          },
        ],
        outgoingRequests: [
          {
            to: '',
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
          },
        ],
        all: [
          {
            publicKey: 'NoWiFi4you',
            typingState: 'NOT_TYPING',
            item: {},
            pending: true,
            activeChat: true,
            encryptedTextilePubkey: '',
            name: 'Taurus Nix',
            address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
            account: {
              accountId: 'Checking Account',
              from: '.',
              status: 429,
              fromMailboxId: '12345',
              toMailboxId: 'v4.0.0-rc.4',
              to: './path/to/file',
            },
            textilePubkey:
              'https://accounts.google.com/o/oauth2/revoke?token=%s',
            status: '',
            state: 'idle',
            unreadCount: 123,
            profilePicture: '',
            badge: 'community',
            userAccount: '',
            mailboxId: '',
          },
        ],
      },
      textile: {
        initialized: true,
        conversations: {},
        conversationLoading: true,
        messageLoading: false,
        uploadProgress: {
          abc: {
            progress: 42,
            finished: false,
            name: 'file.pdf',
          },
        },
      },
      webrtc: {
        initialized: true,
        incomingCall: '',
        activeCall: '',
        connectedPeers: [],
        activeStream: {
          createdAt: 0,
        },
        streaming: true,
        localTracks: { audio: {}, video: {} },
        remoteTracks: { audio: {}, video: {} },
      },
      settings: {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: CaptureMouseTypes.always,
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 96000,
        sampleSize: 24,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          toggleMute: 'alt+m',
          toggleDeafen: 'alt+d',
          openSettings: 'alt+s',
          callActiveChat: 'alt+c',
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
    }
    const commit = jest.fn()
    const dispatch = jest.fn()
    const request = {
      itemIndex: 1,
      files: [
        {
          file: 'path_file_0',
          nsfw: { checking: false, status: false },
          url: 'string',
        },
      ],
      recipientAddress: 'bc23a9d531064583ace8f67dad60f6bb',
    }

    await actions.default.removeUploadItem(
      { commit, rootState, dispatch },
      request,
    )
    expect(commit).toBeCalledWith('setCountError', false)
    expect(commit).toBeCalledWith(
      'deleteFiles',
      'bc23a9d531064583ace8f67dad60f6bb',
    )
    expect(dispatch).toBeCalledWith('textile/clearUploadStatus')

    // Because rootState.textile.messageLoading is false, commit will *not* be called with this.
    expect(commit).not.toBeCalledWith('textile/setMessageLoading', {
      loading: false,
    })
  })
})

describe('actions.default.loadMessages', () => {
  test('load messages', async () => {
    const rootState: RootState = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'true',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        registrationStatus: RegistrationStatus.IN_PROGRESS,
        lastVisited: '',
      },
      dataState: {
        files: DataStateType.Empty,
        friends: DataStateType.Loading,
        search: DataStateType.Ready,
      },
      friends: {
        incomingRequests: [
          {
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
            from: '',
            userInfo: {
              name: '',
              servers: {},
              status: '',
              photoHash: '',
            },
          },
        ],
        outgoingRequests: [
          {
            to: '',
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
          },
        ],
        all: [
          {
            publicKey: 'NoWiFi4you',
            typingState: 'NOT_TYPING',
            item: {},
            pending: true,
            encryptedTextilePubkey: '',
            name: 'Taurus Nix',
            address: 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi', // ADDRESS FOR PEER ID
            account: {
              accountId: 'Checking Account',
              from: '.',
              status: 429,
              fromMailboxId: '12345',
              toMailboxId: 'v4.0.0-rc.4',
              to: './path/to/file',
            },
            textilePubkey:
              'https://accounts.google.com/o/oauth2/revoke?token=%s',
            status: '',
            state: 'idle',
            unreadCount: 123,
            profilePicture: '',
            badge: 'community',
            userAccount: '',
            mailboxId: '',
          },
        ],
      },
      textile: {
        initialized: true,
        conversations: {},
        conversationLoading: true,
        messageLoading: true,
        uploadProgress: {
          abc: {
            progress: 42,
            finished: false,
            name: 'file.pdf',
          },
        },
      },
      webrtc: {
        initialized: true,
        incomingCall: undefined,
        activeCall: undefined,
        streamMuted: {},
      },
      settings: {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: CaptureMouseTypes.always,
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 96000,
        sampleSize: 24,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          toggleMute: 'alt+m',
          toggleDeafen: 'alt+d',
          openSettings: 'alt+s',
          callActiveChat: 'alt+c',
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      conversation: {
        id: '',
        type: 'friend',
        calling: false,
        participants: [
          {
            peerId: 'peerId2',
            address: 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi',
            name: 'name2',
            profilePicture: 'profilePicture2',
            state: ConversationConnection.CONNECTED,
            activity: ConversationActivity.ACTIVE,
            updatedAt: 123,
          },
        ],
      },
    }
    const commit = jest.fn()
    const state = {
      replies: [],
      chatTexts: [],
      files: {},
      countError: false,
      alertNsfw: false,
      containsNsfw: false,
      currentChat: {
        messages: [],
        page: 1,
        size: 10,
        hasNextPage: true,
        direction: ScrollDirections.TOP,
        isMessagesLoading: false,
        lastLoadedMessageId: '',
        isScrollOver: true,
        offset: 0,
        showOlderMessagesInfo: false,
      },
    }
    const argument = 'conversation_id_1'

    await actions.default.loadMessages({ state, commit, rootState }, argument)
    expect(commit).toBeCalledWith('setCurrentChat', { isMessagesLoading: true })
  })
  test('loadMessages but conversationId is false', async () => {
    const rootState: RootState = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'true',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        registrationStatus: RegistrationStatus.IN_PROGRESS,
        lastVisited: '',
      },
      dataState: {
        files: DataStateType.Empty,
        friends: DataStateType.Loading,
        search: DataStateType.Ready,
      },
      friends: {
        incomingRequests: [
          {
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
            from: '',
            userInfo: {
              name: '',
              servers: {},
              status: '',
              photoHash: '',
            },
          },
        ],
        outgoingRequests: [
          {
            to: '',
            requestId: '',
            account: {
              accountId: '',
              from: '',
              status: 123,
              fromMailboxId: '',
              toMailboxId: '',
              to: '',
            },
            pending: true,
          },
        ],
        all: [
          {
            publicKey: 'NoWiFi4you',
            typingState: 'NOT_TYPING',
            item: {},
            pending: true,
            encryptedTextilePubkey: '',
            name: 'Taurus Nix',
            address: 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi', // ADDRESS FOR PEER ID
            account: {
              accountId: 'Checking Account',
              from: '.',
              status: 429,
              fromMailboxId: '12345',
              toMailboxId: 'v4.0.0-rc.4',
              to: './path/to/file',
            },
            textilePubkey:
              'https://accounts.google.com/o/oauth2/revoke?token=%s',
            status: '',
            state: 'idle',
            unreadCount: 123,
            profilePicture: '',
            badge: 'community',
            userAccount: '',
            mailboxId: '',
          },
        ],
      },
      textile: {
        initialized: true,
        conversations: {},
        conversationLoading: true,
        messageLoading: true,
        uploadProgress: {
          abc: {
            progress: 42,
            finished: false,
            name: 'file.pdf',
          },
        },
      },
      webrtc: {
        initialized: true,
        incomingCall: undefined,
        activeCall: undefined,
        streamMuted: {},
      },
      settings: {
        audioInput: '',
        audioOutput: '',
        videoInput: '',
        captureMouse: CaptureMouseTypes.always,
        noiseSuppression: true,
        echoCancellation: true,
        bitrate: 96000,
        sampleSize: 24,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userHasGivenAudioAccess: false,
        userDeniedAudioAccess: false,
        keybinds: {
          toggleMute: 'alt+m',
          toggleDeafen: 'alt+d',
          openSettings: 'alt+s',
          callActiveChat: 'alt+c',
        },
        embeddedLinks: true,
        displayCurrentActivity: true,
      },
      conversation: {
        id: '',
        type: 'friend',
        calling: false,
        participants: [
          {
            peerId: 'peerId2',
            address: 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi',
            name: 'name2',
            profilePicture: 'profilePicture2',
            state: ConversationConnection.CONNECTED,
            activity: ConversationActivity.ACTIVE,
            updatedAt: 123,
          },
        ],
      },
    }
    const commit = jest.fn()
    const state = {
      replies: [],
      chatTexts: [],
      files: {},
      countError: false,
      alertNsfw: false,
      containsNsfw: false,
      currentChat: {
        messages: [],
        page: 1,
        size: 10,
        hasNextPage: true,
        direction: ScrollDirections.TOP,
        isMessagesLoading: false,
        lastLoadedMessageId: '',
        isScrollOver: true,
        offset: 0,
        showOlderMessagesInfo: false,
      },
    }
    const argument = false

    await actions.default.loadMessages({ state, commit, rootState }, argument)
    expect(commit).not.toBeCalledWith('setCurrentChat', {
      isMessagesLoading: true,
    })
  })
})
