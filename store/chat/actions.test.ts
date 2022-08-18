import { expect } from '@jest/globals'
import { RegistrationStatus } from '~/store/accounts/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { RootState } from '~/types/store/store'
import { ScrollDirections } from '~/types/chat/chat'
import {
  ConversationActivity,
  ConversationConnection,
} from '~/store/conversation/types'
import actions from '~/store/chat/actions'

describe('actions.setChatText', () => {
  test('0', async () => {
    const commit = jest.fn()
    const request = {
      userId: 'quidem animi delectus',
      value:
        'In aut ducimus eius ut. Commodi id numquam et tempora officiis aut neque qui necessitatibus. Asperiores ea temporibus et eum facere illum consequatur.',
    }

    await actions.setChatText({ commit }, request)
    expect(commit).toBeCalledWith('chatText', request)
  })
})

describe('actions.loadMessages', () => {
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

    await actions.loadMessages({ state, commit, rootState }, argument)
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

    await actions.loadMessages({ state, commit, rootState }, argument)
    expect(commit).not.toBeCalledWith('setCurrentChat', {
      isMessagesLoading: true,
    })
  })
})
