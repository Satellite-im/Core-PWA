import * as Hounddog from '~/utilities/Hounddog'
import * as WebRTC from '~/store/webrtc/mutations'

import { RegistrationStatus } from '~/store/accounts/types'
import { DataStateType } from '~/store/dataState/types'

describe("Retrieving friend's profile", () => {
  // state.all.find
  let inst: any
  const state: any = {
    accounts: {
      storePin: true,
      loading: true,
      locked: true,
      pin: '',
      pinHash: '',
      active: '',
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
  }

  beforeEach(() => {
    const HounddogConstructor = Hounddog.default
    inst = new HounddogConstructor({
      state,
    })
  })

  test('if any friends exists by matching name', () => {
    const payload: any = {
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
    }

    const result: any = inst.findFriend(payload.name, state.friends) // Uses name as identifier, can also use address / textilePubkey
    expect(result).toMatchSnapshot()
  })

  test('if any friends exists by matching address via the findFriend function', () => {
    const payload: any = {
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
    }

    const result: any = inst.findFriend(payload.address, state.friends) // Uses name as identifier, can also use address / textilePubkey
    expect(result).toMatchSnapshot()
  })

  test('if any friends exists by matching textilePubkey', () => {
    const payload: any = {
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
    }

    const result: any = inst.findFriend(payload.textilePubkey, state.friends) // Uses name as identifier, can also use address / textilePubkey
    expect(result).toMatchSnapshot()
  })

  test('if any friends exists by matching address via the findFriendByAddress function', () => {
    const payload: any = {
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
    }

    const result: any = inst.findFriendByAddress(payload.address, state.friends) // Uses name as identifier, can also use address / textilePubkey
    expect(result).toMatchSnapshot()
  })

  test('if any friends are active', () => {
    const result: any = inst.getActiveFriend(state.friends)
    expect(result).toMatchSnapshot()
  })

  test('if any friends exists by matching address via the friendExists function', () => {
    const payload: any = {
      name: 'Taurus Nix',
      address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      status: 'Some important status message',
      state: 'online',
      last_message:
        'Apollonius of Perga laws of physics colonies paroxysm of global death Jean-François Champollion emerged into consciousness.',
    }

    const result: any = inst.friendExists(state.friends, payload)
    expect(result).toMatchSnapshot()
  })
})

describe('Retrieve WebRTC calls with success', () => {
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
  const payload: any = {
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
  }

  beforeEach(() => {
    WebRTC.default.setActiveCall(state.webrtc, payload.address)
    const HounddogConstructor = Hounddog.default
    inst = new HounddogConstructor({
      state,
    })
  })

  test('Return the first retrieved active call', () => {
    // matchesActiveCall => state.friends.all.find (ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
    const result: any = inst.matchesActiveCall(state)
    expect(result).toMatchSnapshot()
  })

  test('Returns true if at least one active call is retrieved', () => {
    // matchesSomeActiveCall => state.friends.all.some (ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
    const result: any = inst.matchesSomeActiveCall(state)
    expect(result).toMatchSnapshot()
  })
})

describe('Retrieve WebRTC calls with failure', () => {
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
          address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f', // Pay attention to this, in this describe block we will not set this address for the active call so that we get a failure result
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
    WebRTC.default.setActiveCall(state.webrtc, '0x0') //  See comment above
    // WebRTC.default.setActiveCall(state.webrtc, payload.address) // We do not have a payload here due to our need to get a fail result
    const HounddogConstructor = Hounddog.default
    inst = new HounddogConstructor({
      state,
    })
  })

  test('Return the first retrieved active call with failure', () => {
    // matchesActiveCall => state.friends.all.find (ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
    const result: any = inst.matchesActiveCall(state)
    expect(result).toMatchSnapshot() // Will return undefined because no active calls are found in this describe block
  })

  test('Returns true if at least one active call is retrieved with failure', () => {
    // matchesSomeActiveCall => state.friends.all.some (ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
    const result: any = inst.matchesSomeActiveCall(state)
    expect(result).toMatchSnapshot() // Will return false because no active calls are found in this describe block
  })
})
