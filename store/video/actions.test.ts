import * as module from './actions'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { RegistrationStatus } from '~/store/accounts/types'
import {
  ConversationActivity,
  ConversationConnection,
} from '~/store/conversation/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { RootState } from '~/types/store/store'
// Commented out for later development.
// import { $WebRTC } from '~/libraries/WebRTC/WebRTC'

// jest.mock('~/libraries/WebRTC/WebRTC')
// $WebRTC.mockImplementation(() => {
//   getCall: {
//     return false
//   }
// })

describe('', () => {
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
  test('0', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state = {
      disabled: true,
    }
    const rootState = { ...initialRootState }
    module.default.toggle({ state, commit, dispatch, rootState })
    expect(commit).toHaveBeenCalledWith('setDisabled', !state.disabled)
    expect(dispatch).toHaveBeenCalledWith('sounds/playSound', Sounds.MUTE, {
      root: true,
    })
  })
  test('1', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state = {
      disabled: false,
    }
    const rootState = { ...initialRootState }
    module.default.toggle({ state, commit, dispatch, rootState })
    expect(commit).toHaveBeenCalledWith('setDisabled', !state.disabled)
    expect(dispatch).toHaveBeenCalledWith('sounds/playSound', Sounds.UNMUTE, {
      root: true,
    })
  })
  test.skip('2', () => {
    // This is
    const commit = jest.fn()
    const dispatch = jest.fn()
    const state = {
      disabled: false,
    }
    const rootState = { ...initialRootState }
    rootState.webrtc.activeCall = {
      callId: 'something',
      peerId: 'something',
      //   mute: jest.fn(),
      //   unmute: jest.fn(),
    }
    module.default.toggle({ state, commit, dispatch, rootState })
    expect(commit).toHaveBeenCalledWith('setDisabled', !state.disabled)
    // Unsuccessful mock here for WebRTC's Call function.
    // expect(rootState.webrtc.activeCall).toHaveBeenCalledWith({
    //   kind: 'audio',
    // })
  })
})
