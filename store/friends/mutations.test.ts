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
  let inst: any

  beforeEach(() => {
    inst = mutations
  })

  test('add friend', () => {
    const payload: any = {
      name: 'Yusuf Mangunwijaya',
      address: '0x1',
      typingState: 'NOT_TYPING',
      activeChat: false,
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
      activeChat: true, // Change from false (above) to true
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
      activeChat: true, // Change from false (above) to true
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
      activeChat: true, // Change from false (above) to true
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
      typingState: 'TYPING', // Change the value here so we can detect it in the the expect() below
      activeChat: true,
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
      typingState: 'TYPING',
    })
    expect(InitialFriendsState.all).toMatchSnapshot()
  })

  test('update friend', () => {
    const payload: any = {
      name: 'Y. Mangunwijaya', //  Abbreviate the name from Yusuf to Y.
      address: '0x1',
      typingState: 'NOT_TYPING',
      activeChat: false,
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
      activeChat: false,
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
