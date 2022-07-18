import dayjs from 'dayjs'
import { expect } from '@jest/globals'
import * as WebRTC from '~/store/webrtc/mutations'
dayjs.duration = jest.fn().mockReturnValueOnce({
  hours: () => 1645617999076,
  format: () => '12:34',
})

describe('Mutate WebRTC by setting', () => {
  let inst: any
  const state: any = {
    webrtc: {
      initialized: true,
      incomingCall: '',
      activeCall: '',
      remotePeers: {},
      streamMuted: {},
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
  }

  beforeEach(() => {
    inst = WebRTC.default
  })

  it('should initialize', () => {
    const localStateForUnitTest = { ...state }
    inst.setInitialized(localStateForUnitTest, true)

    expect(localStateForUnitTest).toMatchObject({
      webrtc: { initialized: true },
    })
  })

  it('should initialize with default value for parameters', () => {
    const localStateForUnitTest = { ...state }
    inst.setInitialized(localStateForUnitTest)

    expect(localStateForUnitTest).toMatchObject({
      webrtc: { initialized: true },
    })
  })

  it('should set incoming call', () => {
    const localStateForUnitTest = { ...state }
    inst.setIncomingCall(localStateForUnitTest, '0x0')

    expect(localStateForUnitTest).toMatchObject({
      incomingCall: '0x0',
    })
  })

  it('should set active call', () => {
    const localStateForUnitTest = { ...state }
    inst.setActiveCall(localStateForUnitTest, '0x0')

    expect(localStateForUnitTest).toMatchObject({
      activeCall: '0x0',
    })
  })

  it('should update createdAt', () => {
    const localStateForUnitTest = { ...state }
    inst.updateCreatedAt(localStateForUnitTest, 0x0)

    expect(localStateForUnitTest).toMatchObject({
      createdAt: 0x0,
    })
  })

  it('should set streamMuted', () => {
    const localStateForUnitTest = { ...state }
    const argument = {
      peerId: 'id',
      audio: true,
      video: true,
      screen: true,
    }
    inst.setStreamMuted(localStateForUnitTest, argument)

    expect(localStateForUnitTest.streamMuted).toMatchObject({
      id: {
        audio: true,
        video: true,
        screen: true,
      },
    })
  })

  it('should set streamMuted without peerId', () => {
    const localStateForUnitTest = { ...state }
    const argument = {
      peerId: null,
      audio: true,
      video: true,
      screen: true,
    }
    inst.setStreamMuted(localStateForUnitTest, argument)

    expect(localStateForUnitTest).not.toMatchObject({
      streamMuted: {
        id: {
          audio: true,
          video: true,
          screen: true,
        },
      },
    })
  })

  it('should set streamMuted without peerId and with default arguments', () => {
    const localStateForUnitTest = { ...state }
    const argument = {
      peerId: null,
      // Commented out because we want to test if default values will come in.
      // audio: true,
      // video: true,
      // screen: true,
    }
    inst.setStreamMuted(localStateForUnitTest, argument)

    expect(localStateForUnitTest).not.toMatchObject({
      streamMuted: {
        id: {
          audio: true,
          video: true,
          screen: true,
        },
      },
    })
  })

  it('should set muted', () => {
    const localStateForUnitTest = { ...state }
    const argument = {
      peerId: 'id',
      audio: true,
      video: true,
      screen: true,
    }
    inst.setStreamMuted(localStateForUnitTest, argument)
    const secondArgument = {
      peerId: 'id',
      kind: 'audio',
      muted: false,
    }
    inst.setMuted(localStateForUnitTest, secondArgument) // Audio muted is now false.

    expect(localStateForUnitTest.streamMuted).toMatchObject({
      id: { audio: false, video: true, screen: true },
    })
  })

  it('should toggle mute', () => {
    const localStateForUnitTest = { ...state }
    const argument = {
      peerId: 'id',
      audio: true,
      video: true,
      screen: true,
    }
    inst.setStreamMuted(localStateForUnitTest, argument)
    const secondArgument = {
      peerId: 'id',
      kind: 'audio',
      muted: false,
    }
    inst.setMuted(localStateForUnitTest, secondArgument)
    const thirdArgument = {
      peerId: 'id',
      kind: 'audio',
    }
    inst.toggleMute(localStateForUnitTest, thirdArgument) // Audio muted is now true again.

    expect(localStateForUnitTest.streamMuted).toMatchObject({
      id: { audio: true, video: true, screen: true },
    })
  })

  it('should update elapsed time', () => {
    const localStateForUnitTest = { ...state }
    inst.updateElapsedTime(localStateForUnitTest)
    expect(localStateForUnitTest.elapsedTime).toBe('1645617999076:12:34')
  })
})
