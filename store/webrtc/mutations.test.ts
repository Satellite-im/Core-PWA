import { expect } from '@jest/globals'
import * as WebRTC from '~/store/webrtc/mutations'

describe('Mutate WebRTC by setting', () => {
  let inst: any
  const state: any = {
    webrtc: {
      initialized: true,
      incomingCall: '',
      activeCall: '',
      connectedPeers: [],
      streaming: true,
      activeStream: {
        createdAt: 123,
      },
      remoteTracks: {
        audio: {
          id: '',
          muted: true,
        },
        video: {
          id: '',
          muted: true,
        },
      },
      localTracks: {
        audio: {
          id: '',
          muted: true,
        },
        video: {
          id: '',
          muted: true,
        },
      },
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
  }

  beforeEach(() => {
    inst = WebRTC.default
  })

  it('should initialize', () => {
    const localStateForUnitTest = { ...state }
    inst.setInitialized(localStateForUnitTest, true)

    expect(localStateForUnitTest).toMatchObject({
      initialized: true,
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

  it('should set connected peers', () => {
    const localStateForUnitTest = { ...state }
    inst.setAllConnectedPeers(localStateForUnitTest, ['0x0', '0x1', '0x2'])

    expect(localStateForUnitTest).toMatchObject({
      connectedPeers: ['0x0', '0x1', '0x2'],
    })
  })
})

describe('Mutate WebRTC by updating', () => {
  let inst: any
  const state: any = {
    webrtc: {
      initialized: true,
      incomingCall: '',
      activeCall: '',
      connectedPeers: [],
      streaming: true,
      activeStream: {
        createdAt: 123,
      },
      remoteTracks: {
        audio: {
          id: '',
          muted: true,
        },
        video: {
          id: '',
          muted: true,
        },
      },
      localTracks: {
        audio: {
          id: '',
          muted: true,
        },
        video: {
          id: '',
          muted: true,
        },
      },
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
  }

  beforeEach(() => {
    inst = WebRTC.default
  })

  it('should update local tracks with audio', () => {
    const localStateForUnitTest = { ...state }
    inst.updateLocalTracks(localStateForUnitTest, {
      audio: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      localTracks: {
        audio: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update local tracks with video', () => {
    const localStateForUnitTest = { ...state }
    inst.updateLocalTracks(localStateForUnitTest, {
      video: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      localTracks: {
        video: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update remote tracks with audio', () => {
    const localStateForUnitTest = { ...state }
    inst.updateRemoteTracks(localStateForUnitTest, {
      audio: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      remoteTracks: {
        audio: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update remote tracks with video', () => {
    const localStateForUnitTest = { ...state }
    inst.updateRemoteTracks(localStateForUnitTest, {
      video: {
        id: '',
        muted: false,
      },
    })

    expect(localStateForUnitTest).toMatchObject({
      remoteTracks: {
        video: {
          id: '',
          muted: false,
        },
      },
    })
  })

  it('should update time of creation', () => {
    /*
     * This particular test suite somehow has an error: TypeError: Cannot set properties of undefined (setting 'createdAt')
     * How we bypassed it is by passing `state.webrtc` instead of just plainly `state` like in the other unit test
     */

    const localStateForUnitTest = { ...state }
    const dummyDate = Date.now()
    inst.updateCreatedAt(localStateForUnitTest.webrtc, dummyDate)

    expect(localStateForUnitTest.webrtc).toMatchObject({
      activeStream: {
        createdAt: dummyDate,
      },
    })
  })
})
