import { expect } from '@jest/globals'
import * as WebRTC from '~/store/webrtc/mutations'

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
})
