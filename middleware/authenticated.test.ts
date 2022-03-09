import * as authenticated from './authenticated'
import { RegistrationStatus } from '~/store/accounts/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { RootState } from '~/types/store/store'

const initialRootState: RootState = {
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
        textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
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

describe('', () => {
  test('the user is not authenticated', () => {
    const inst = authenticated.default
    const param1 = {
      state: initialRootState,
      getters: { allPrerequisitesReady: true },
    }
    const param2: () => void = () => {}
    const param3 = { chunkName: 'string', path: 'path' }

    expect(
      inst({
        store: param1,
        redirect: param2,
        route: param3,
      }),
    ).toMatchSnapshot()
  })
  test('the wallet has not been created yet', () => {
    const inst = authenticated.default
    initialRootState.accounts.locked = false
    initialRootState.accounts.phrase = ''
    const param1 = {
      state: initialRootState,
      getters: { allPrerequisitesReady: true },
    }
    const param2: () => void = () => {}
    const param3 = { chunkName: 'string', path: 'https://example.com/page1' }

    expect(
      inst({
        store: param1,
        redirect: param2,
        route: param3,
      }),
    ).toMatchSnapshot()
  })
  test('param3 path included in config', () => {
    const inst = authenticated.default
    initialRootState.accounts.locked = false
    initialRootState.accounts.phrase = ''
    const param1 = {
      state: initialRootState,
      getters: { allPrerequisitesReady: true },
    }
    const param2: () => void = () => {
      return 'https://example.com/page1'
    }
    const param3 = { chunkName: 'string', path: 'ab/setup' }

    expect(
      inst({
        store: param1,
        redirect: param2,
        route: param3,
      }),
    ).toMatchSnapshot()
  })
  test('all prerequisites not ready', () => {
    const inst = authenticated.default
    initialRootState.accounts.locked = false
    initialRootState.accounts.phrase = ''
    const param1 = {
      state: initialRootState,
      getters: { allPrerequisitesReady: false },
    }
    const param2: () => void = () => {
      return 'https://example.com/page1'
    }
    const param3 = { chunkName: 'string', path: 'ab/setup' }

    expect(
      inst({
        store: param1,
        redirect: param2,
        route: param3,
      }),
    ).toMatchSnapshot()
  })
  test('store.commit called', () => {
    const inst = authenticated.default
    initialRootState.accounts.locked = false
    initialRootState.accounts.phrase = ''
    const param1 = {
      state: initialRootState,
      getters: { allPrerequisitesReady: true },
      commit: jest.fn(),
    }
    const param2: () => void = () => {
      return 'https://example.com/page1'
    }
    const param3 = { chunkName: 'string', path: 'ab/notsetup' }

    expect(
      inst({
        store: param1,
        redirect: param2,
        route: param3,
      }),
    ).toMatchSnapshot()
    expect(param1.commit).toHaveBeenCalled()
  })
})
