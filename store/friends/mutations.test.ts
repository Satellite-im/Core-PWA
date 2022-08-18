import { expect } from '@jest/globals'
import mutations from '~/store/friends/mutations'

describe('mutate incoming requests', () => {
  const InitialFriendsState = {
    incomingRequests: [
      {
        requestId: 'incomingRequestsItem0',
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
  }
  let inst: any

  beforeEach(() => {
    inst = mutations
  })

  test('set incoming requests', () => {
    const payload = [
      {
        requestId: 'incomingRequestsItem1',
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
    ]

    inst.setIncomingRequests(InitialFriendsState, payload)
    expect(InitialFriendsState.incomingRequests).toEqual(payload)
  })

  test('add incoming requests', () => {
    const payload = {
      requestId: 'incomingRequestsItem2',
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
    }

    inst.addIncomingRequest(InitialFriendsState, payload)
    expect(InitialFriendsState.incomingRequests).toContainEqual(payload)
  })

  test('update incoming requests', () => {
    const payload = {
      // Recall that this item has been appended to the state, above; here we change pending status from true to false
      requestId: 'incomingRequestsItem2',
      account: {
        accountId: '',
        from: '',
        status: 123,
        fromMailboxId: '',
        toMailboxId: '',
        to: '',
      },
      pending: false,
      from: '',
      userInfo: {
        name: '',
        servers: {},
        status: '',
        photoHash: '',
      },
    }

    inst.updateIncomingRequest(InitialFriendsState, payload)
    expect(InitialFriendsState.incomingRequests).toContainEqual(payload)
  })

  test('delete incoming requests', () => {
    const payload = {
      // We will remove this item that was added above (incomingRequestsItem2)
      requestId: 'incomingRequestsItem2',
      account: {
        accountId: '',
        from: '',
        status: 123,
        fromMailboxId: '',
        toMailboxId: '',
        to: '',
      },
      pending: false,
      from: '',
      userInfo: {
        name: '',
        servers: {},
        status: '',
        photoHash: '',
      },
    }

    inst.removeIncomingRequest(InitialFriendsState, payload.requestId)
    expect(InitialFriendsState.incomingRequests).not.toContainEqual(payload)
  })
})

describe('mutate outgoing requests', () => {
  const InitialFriendsState = {
    incomingRequests: [
      {
        requestId: 'incomingRequestsItem0',
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
        requestId: 'outgoingRequestsItem0',
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
  }
  let inst: any

  beforeEach(() => {
    inst = mutations
  })

  test('set outgoing requests', () => {
    const payload = [
      {
        requestId: 'outgoingRequestsItem1',
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
    ]

    inst.setOutgoingRequests(InitialFriendsState, payload)
    expect(InitialFriendsState.outgoingRequests).toEqual(payload)
  })

  test('add outgoing requests', () => {
    const payload = {
      requestId: 'outgoingRequestsItem2',
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
    }

    inst.addOutgoingRequest(InitialFriendsState, payload)
    expect(InitialFriendsState.outgoingRequests).toContainEqual(payload)
  })

  test('update outgoing requests', () => {
    const payload = {
      // Recall that this item has been appended to the state, above; here we change pending status from true to false
      requestId: 'outgoingRequestsItem2',
      account: {
        accountId: '',
        from: '',
        status: 123,
        fromMailboxId: '',
        toMailboxId: '',
        to: '',
      },
      pending: false,
      from: '',
      userInfo: {
        name: '',
        servers: {},
        status: '',
        photoHash: '',
      },
    }

    inst.updateOutgoingRequest(InitialFriendsState, payload)
    expect(InitialFriendsState.outgoingRequests).toContainEqual(payload)
  })

  test('delete outgoing requests', () => {
    const payload = {
      // We will remove this item that was added above (outgoingRequestsItem2)
      requestId: 'outgoingRequestsItem2',
      account: {
        accountId: '',
        from: '',
        status: 123,
        fromMailboxId: '',
        toMailboxId: '',
        to: '',
      },
      pending: false,
      from: '',
      userInfo: {
        name: '',
        servers: {},
        status: '',
        photoHash: '',
      },
    }

    inst.removeOutgoingRequest(InitialFriendsState, payload.requestId)
    expect(InitialFriendsState.outgoingRequests).not.toContainEqual(payload)
  })
})

describe('mutate friends', () => {
  const InitialFriendsState = {
    incomingRequests: [
      {
        requestId: 'incomingRequestsItem0',
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
        requestId: 'outgoingRequestsItem0',
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
  }
  let inst: any

  beforeEach(() => {
    inst = mutations
  })

  test('add friend', () => {
    const payload: any = {
      name: 'Yusuf Mangunwijaya',
      address: '0x1',
      typingState: 'NOT_TYPING',
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.addFriend(InitialFriendsState, payload)
    expect(InitialFriendsState.all).toContainEqual(payload)
  })

  test('set chat active', () => {
    const payload: any = {
      name: 'Yusuf Mangunwijaya',
      address: '0x1',
      typingState: 'NOT_TYPING',
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.setActive(InitialFriendsState, payload)
    expect(InitialFriendsState.all).toContainEqual(payload)
  })

  test('set store true', () => {
    const payload: any = {
      name: 'Yusuf Mangunwijaya',
      address: '0x1',
      typingState: 'NOT_TYPING',
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.setStored(InitialFriendsState, payload)
    expect(InitialFriendsState.all).toMatchSnapshot()
  })

  test('set store false', () => {
    const payload: any = {
      name: 'Yusuf Mangunwijaya',
      address: '0x1',
      typingState: 'NOT_TYPING',
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.setStored(InitialFriendsState, payload, false)
    expect(InitialFriendsState.all).toMatchSnapshot()
  })

  test('set typing state', () => {
    const payload: any = {
      name: 'Yusuf Mangunwijaya',
      address: '0x1', // We will just use this
      typingState: 'NOT_TYPING', // Change the value here so we can detect it in the the expect() below
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.setTyping(InitialFriendsState, {
      id: payload.address,
      // typingState: 'TYPING',
    })
    expect(InitialFriendsState.all).toMatchSnapshot()
  })

  test('set typing state but non-identical address', () => {
    const payload: any = {
      name: 'Yusuf Mangunwijaya',
      address: '0x1', // We will just use this
      typingState: 'TYPING', // Change the value here so we can detect it in the the expect() below
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.setTyping(InitialFriendsState, {
      id: '0x2', // 0x2 rather than 0x1
      typingState: undefined,
    })
    expect(InitialFriendsState.all).toMatchSnapshot()
  })

  test('update friend', () => {
    const payload: any = {
      name: 'Y. Mangunwijaya', //  Abbreviate the name from Yusuf to Y.
      address: '0x1',
      typingState: 'NOT_TYPING',
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      stored: false,
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.updateFriend(InitialFriendsState, payload)
    expect(InitialFriendsState.all).toContainEqual(payload)
  })

  test('delete friend', () => {
    const payload: any = {
      name: 'Y. Mangunwijaya',
      address: '0x1',
      typingState: 'NOT_TYPING',
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=429',
    }

    inst.removeFriend(InitialFriendsState, payload.address)
    expect(InitialFriendsState.all).not.toContainEqual(payload)
  })
})

describe('mutations.updateIncomingRequest', () => {
  test('0', () => {
    const result: any = mutations.updateIncomingRequest(
      { incomingRequests: { map: () => 'Jean-Philippe' } },
      { requestId: 'c466a48309794261b64a4f02cfcc3d64' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.updateIncomingRequest(
      { incomingRequests: { map: () => 'George' } },
      { requestId: 'c466a48309794261b64a4f02cfcc3d64' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.updateIncomingRequest(
      { incomingRequests: { map: () => 'Michael' } },
      { requestId: '12345' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.updateIncomingRequest(
      { incomingRequests: { map: () => 'George' } },
      { requestId: '12345' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.updateIncomingRequest(
      { incomingRequests: { map: () => 'Pierre Edouard' } },
      { requestId: 'c466a48309794261b64a4f02cfcc3d64' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.updateIncomingRequest(
      { incomingRequests: { map: () => '' } },
      { requestId: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.addIncomingRequest', () => {
  test('0', () => {
    const result: any = mutations.addIncomingRequest(
      { incomingRequests: { push: () => 16 } },
      'https://',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.addIncomingRequest(
      { incomingRequests: { push: () => 0 } },
      'https://croplands.org/app/a/reset?token=',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.addIncomingRequest(
      { incomingRequests: { push: () => 10 } },
      'https://twitter.com/path?abc',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.addIncomingRequest(
      { incomingRequests: { push: () => 256 } },
      'https://croplands.org/app/a/confirm?t=',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.addIncomingRequest(
      { incomingRequests: { push: () => 32 } },
      'http://www.croplands.org/account/confirm?t=',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.addIncomingRequest(
      { incomingRequests: { push: () => -Infinity } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.removeIncomingRequest', () => {
  test('0', () => {
    const result: any = mutations.removeIncomingRequest(
      { incomingRequests: { filter: () => true } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.removeIncomingRequest(
      { incomingRequests: { filter: () => true } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      '9876',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.removeIncomingRequest(
      { incomingRequests: { filter: () => false } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.updateOutgoingRequest', () => {
  test('0', () => {
    const result: any = mutations.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Jean-Philippe' } },
      { requestId: '12345' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Anas' } },
      { requestId: 'da7588892' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Jean-Philippe' } },
      { requestId: '9876' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'George' } },
      { requestId: '9876' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.updateOutgoingRequest(
      { outgoingRequests: { map: () => 'Michael' } },
      { requestId: '9876' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.updateOutgoingRequest(
      { outgoingRequests: { map: () => '' } },
      { requestId: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.addOutgoingRequest', () => {
  test('0', () => {
    const result: any = mutations.addOutgoingRequest(
      { outgoingRequests: { push: () => 256 } },
      400,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.addOutgoingRequest(
      { outgoingRequests: { push: () => 64 } },
      400,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.addOutgoingRequest(
      { outgoingRequests: { push: () => 0 } },
      500,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.addOutgoingRequest(
      { outgoingRequests: { push: () => 256 } },
      404,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.addOutgoingRequest(
      { outgoingRequests: { push: () => 32 } },
      404,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.addOutgoingRequest(
      { outgoingRequests: { push: () => Infinity } },
      Infinity,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.removeOutgoingRequest', () => {
  test('0', () => {
    const result: any = mutations.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      '12345',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      'c466a48309794261b64a4f02cfcc3d64',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.removeOutgoingRequest(
      { outgoingRequests: { filter: () => false } },
      '12345',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.removeOutgoingRequest(
      { outgoingRequests: { filter: () => false } },
      'da7588892',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      '9876',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.removeOutgoingRequest(
      { outgoingRequests: { filter: () => true } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.addFriend', () => {
  test('0', () => {
    const result: any = mutations.addFriend(
      { all: { push: () => 32 } },
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.addFriend(
      { all: { push: () => 256 } },
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.addFriend(
      { all: { push: () => 32 } },
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.addFriend(
      { all: { push: () => 32 } },
      'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.addFriend(
      { all: { push: () => 64 } },
      'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.addFriend(
      { all: { push: () => -Infinity } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.setActive', () => {
  test('0', () => {
    const result: any = mutations.setActive(
      { all: { map: () => 'Pierre Edouard' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.setActive(
      { all: { map: () => 'George' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.setActive(
      { all: { map: () => 'Pierre Edouard' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.setActive(
      { all: { map: () => 'Edmond' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.setActive(
      { all: { map: () => 'Anas' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.setActive(
      { all: { map: () => '' } },
      { address: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.setStored', () => {
  test('0', () => {
    const result: any = mutations.setStored(
      { all: { map: () => 'Edmond' } },
      { address: '0.0.0.0' },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.setStored(
      { all: { map: () => 'Michael' } },
      { address: '192.168.1.5' },
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.setStored(
      { all: { map: () => 'Jean-Philippe' } },
      { address: '0.0.0.0' },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.setStored(
      { all: { map: () => 'Edmond' } },
      { address: '192.168.1.5' },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.setStored(
      { all: { map: () => 'Anas' } },
      { address: '192.168.1.5' },
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.setStored(
      { all: { map: () => '' } },
      { address: '' },
      true,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.setNote', () => {
  test('real', () => {
    const localState = {
      incomingRequests: [
        {
          requestId: 'incomingRequestsItem0',
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
          localSypingState: 'NOT_TYPING',
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
    }
    const argument = {
      id: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      note: 'zeroxzero',
    }

    mutations.setNote(localState, argument)
    expect(localState.all).toMatchSnapshot()
  })

  test('real but non-identical id', () => {
    const localState = {
      incomingRequests: [
        {
          requestId: 'incomingRequestsItem0',
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
          localSypingState: 'NOT_TYPING',
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
    }
    const argument = {
      id: '1xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f', // 1x rather than 0x
      note: 'zeroxzero',
    }

    mutations.setNote(localState, argument)
    expect(localState.all).toMatchSnapshot()
  })

  test('0', () => {
    const result: any = mutations.setNote(
      { all: { map: () => 'Michael' } },
      {
        address: '0.0.0.0',
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        note: 'v1.2.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.setNote(
      { all: { map: () => 'Anas' } },
      {
        address: '192.168.1.5',
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        note: 'v4.0.0-rc.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.setNote(
      { all: { map: () => 'Anas' } },
      {
        address: '0.0.0.0',
        id: 'a85a8e6b-348b-4011-a1ec-1e78e9620782',
        note: 'v1.2.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.setNote(
      { all: { map: () => 'Anas' } },
      {
        address: '192.168.1.5',
        id: '03ea49f8-1d96-4cd0-b279-0684e3eec3a9',
        note: 'v1.2.4',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.setNote(
      { all: { map: () => 'George' } },
      {
        address: '192.168.1.5',
        id: '7289708e-b17a-477c-8a77-9ab575c4b4d8',
        note: '1.0.0',
      },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.setNote(
      { all: { map: () => '' } },
      { address: '', id: '', note: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.updateFriend', () => {
  test('0', () => {
    const result: any = mutations.updateFriend(
      { all: { map: () => 'Anas' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.updateFriend(
      { all: { map: () => 'Jean-Philippe' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.updateFriend(
      { all: { map: () => 'Michael' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.updateFriend(
      { all: { map: () => 'Anas' } },
      { address: '0.0.0.0' },
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.updateFriend(
      { all: { map: () => 'Jean-Philippe' } },
      { address: '192.168.1.5' },
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.updateFriend(
      { all: { map: () => '' } },
      { address: '' },
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.removeFriend', () => {
  test('0', () => {
    const result: any = mutations.removeFriend(
      { all: { filter: () => false } },
      '192.168.1.5',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = mutations.removeFriend(
      { all: { filter: () => false } },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = mutations.removeFriend(
      { all: { filter: () => true } },
      '0.0.0.0',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = mutations.removeFriend(
      { all: { filter: () => true } },
      '192.168.1.5',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = mutations.removeFriend(
      { all: { filter: () => false } },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('mutations.sortFriends', () => {
  test('0', () => {
    const object: any = [
      [true, false, true, false],
      [true, true, true, false],
      [true, true, true, false],
      [true, false, true, false],
    ]
    const result: any = mutations.sortFriends({ all: object }, [
      'https://api.telegram.org/',
      'https://api.telegram.org/',
      'www.google.com',
      'https://croplands.org/app/a/reset?token=',
    ])
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      [false, false, false, false],
      [true, false, true, false],
      [true, false, false, false],
      [false, false, false, true],
    ]
    const result: any = mutations.sortFriends({ all: object }, [
      'Www.GooGle.com',
      'https://',
      'www.google.com',
      '.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [
      [false, false, false, false],
      [true, true, false, false],
      [true, false, true, false],
      [true, false, false, true],
    ]
    const result: any = mutations.sortFriends({ all: object }, [
      'https://accounts.google.com/o/oauth2/revoke?token=%s',
      'www.google.com',
      'Www.GooGle.com',
      'Www.GooGle.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      [true, false, true, false],
      [false, false, true, true],
      [false, true, false, false],
      [true, true, true, false],
    ]
    const result: any = mutations.sortFriends({ all: object }, [
      'https://croplands.org/app/a/reset?token=',
      'http://base.com',
      'http://www.croplands.org/account/confirm?t=',
      'http://base.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      [false, false, false, true],
      [true, false, true, true],
      [false, true, true, false],
      [true, true, false, false],
    ]
    const result: any = mutations.sortFriends({ all: object }, [
      'https://',
      'https://api.telegram.org/bot',
      'https://croplands.org/app/a/confirm?t=',
      'www.google.com',
    ])
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.sortFriends({ all: [] }, [])
    expect(result).toMatchSnapshot()
  })
})
