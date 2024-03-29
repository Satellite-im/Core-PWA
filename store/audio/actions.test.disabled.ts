import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { RegistrationStatus } from '~/store/accounts/types'
import * as actions from '~/store/audio/actions'
import initialAudioState from '~/store/audio/state'
import { AudioState } from '~/store/audio/types'
import {
  ConversationActivity,
  ConversationConnection,
} from '~/store/conversation/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { RootState } from '~/types/store/store'

jest.mock('~/libraries/WebRTC/WebRTC', () => ({
  $WebRTC: {
    getCall: jest.fn(),
  },
}))
const muteMock = jest.fn()
const unmuteMock = jest.fn()
$WebRTC.getCall.mockReturnValue({
  mute: muteMock,
  unmute: unmuteMock,
})
afterEach(() => {
  jest.clearAllMocks()
})

describe('actions.default.toggleMute', () => {
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
    webrtc: {
      initialized: true,
      incomingCall: undefined,
      activeCall: {
        callId: 'call-id',
        peerId: 'peer-id',
      },
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
    audio: initialAudioState(),
  }

  test('Should mute audio', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state: AudioState = {
      ...initialAudioState(),
      muted: true,
    }
    const rootState = { ...initialRootState }
    actions.default.toggleMute({ state, commit, dispatch, rootState })
    expect(commit).toHaveBeenCalledWith('toggleMute')
    expect(dispatch).toHaveBeenCalledWith('sounds/playSound', Sounds.MUTE, {
      root: true,
    })
    expect(muteMock).toHaveBeenCalledWith({ kind: 'audio' })
  })

  test('Should unmute audio', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state: AudioState = {
      ...initialAudioState(),
      muted: false,
    }
    const rootState = { ...initialRootState }
    actions.default.toggleMute({ state, commit, dispatch, rootState })
    expect(commit).toHaveBeenCalledWith('toggleMute')
    expect(dispatch).toHaveBeenCalledWith('sounds/playSound', Sounds.UNMUTE, {
      root: true,
    })
    expect(unmuteMock).toHaveBeenCalledWith({ kind: 'audio' })
  })
})

describe('actions.default.toggleDeafen', () => {
  test('0', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state = {
      deafened: false,
    }

    await actions.default.toggleDeafen({ commit, dispatch, state })
    expect(dispatch).toBeCalledWith('sounds/playSound', Sounds.DEAFEN, {
      root: true,
    })
  })

  test('1', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state = {
      deafened: true,
    }

    await actions.default.toggleDeafen({ commit, dispatch, state })
    expect(dispatch).toBeCalledWith('sounds/playSound', Sounds.UNDEAFEN, {
      root: true,
    })
  })
})
