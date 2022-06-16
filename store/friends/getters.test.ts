import * as module from './getters'
import { FriendsState } from './types'
import { RegistrationStatus } from '~/store/accounts/types'
import {
  ConversationActivity,
  ConversationConnection,
} from '~/store/conversation/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { RootState } from '~/types/store/store'

describe('', () => {
  const initialFriendsState: FriendsState = {
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
        userInfo: {
          address: 'a',
          name: 'a',
          photoHash: 'a',
          status: 'a',
          bannerImageHash: 'a',
          extra1: 'a',
          extra2: 'a',
        },
      },
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
        userInfo: {
          address: 'b',
          name: 'b',
          photoHash: 'b',
          status: 'b',
          bannerImageHash: 'b',
          extra1: 'b',
          extra2: 'b',
        },
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
      activeCall: {
        peerId: 'peer_1234',
        callId: 'call_1234',
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
  }
  test('module.default.findFriendByKey', () => {
    const localState: FriendsState = { ...initialFriendsState }
    const originalFunction = module.default.findFriendByKey(localState)
    const result = originalFunction(
      // We have to call the function this way because of how it was declared in ./getters.ts
      'https://accounts.google.com/o/oauth2/revoke?token=%s',
    )
    expect(result).toEqual({
      account: {
        accountId: 'Checking Account',
        from: '.',
        fromMailboxId: '12345',
        status: 429,
        to: './path/to/file',
        toMailboxId: 'v4.0.0-rc.4',
      },
      activeChat: true,
      address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      badge: 'community',
      encryptedTextilePubkey: '',
      item: {},
      localSypingState: 'NOT_TYPING',
      mailboxId: '',
      name: 'Taurus Nix',
      pending: true,
      profilePicture: '',
      publicKey: 'NoWiFi4you',
      state: 'idle',
      status: '',
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
      unreadCount: 123,
      userAccount: '',
    })
  })
  test('module.default.findFriendByAddress', () => {
    const localState: FriendsState = { ...initialFriendsState }
    const originalFunction = module.default.findFriendByAddress(localState)
    const result = originalFunction(
      // We have to call the function this way because of how it was declared in ./getters.ts
      '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    )
    expect(result).toEqual({
      account: {
        accountId: 'Checking Account',
        from: '.',
        fromMailboxId: '12345',
        status: 429,
        to: './path/to/file',
        toMailboxId: 'v4.0.0-rc.4',
      },
      activeChat: true,
      address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      badge: 'community',
      encryptedTextilePubkey: '',
      item: {},
      localSypingState: 'NOT_TYPING',
      mailboxId: '',
      name: 'Taurus Nix',
      pending: true,
      profilePicture: '',
      publicKey: 'NoWiFi4you',
      state: 'idle',
      status: '',
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
      unreadCount: 123,
      userAccount: '',
    })
  })
  test('module.default.getActiveFriend', () => {
    const localState: FriendsState = { ...initialFriendsState }
    localState.all.push({
      publicKey: 'duplicate_NoWiFi4you',
      localSypingState: 'NOT_TYPING',
      item: {},
      pending: true,
      activeChat: true,
      encryptedTextilePubkey: 'duplicate_',
      name: 'duplicate_Taurus Nix',
      address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      account: {
        accountId: 'duplicate_Checking Account',
        from: 'duplicate_.',
        status: 429,
        fromMailboxId: 'duplicate_12345',
        toMailboxId: 'duplicate_v4.0.0-rc.4',
        to: 'duplicate_./path/to/file',
      },
      textilePubkey:
        'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
      status: 'duplicate_',
      state: 'online', // Duplicate entry: changed from idle to online
      unreadCount: 123,
      profilePicture: 'duplicate_',
      badge: 'community',
      userAccount: 'duplicate_',
      mailboxId: 'duplicate_',
    })
    const result = module.default.getActiveFriend(localState)
    expect(result).toEqual({
      account: {
        accountId: 'duplicate_Checking Account',
        from: 'duplicate_.',
        fromMailboxId: 'duplicate_12345',
        status: 429,
        to: 'duplicate_./path/to/file',
        toMailboxId: 'duplicate_v4.0.0-rc.4',
      },
      activeChat: true,
      address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      badge: 'community',
      encryptedTextilePubkey: 'duplicate_',
      item: {},
      localSypingState: 'NOT_TYPING',
      mailboxId: 'duplicate_',
      name: 'duplicate_Taurus Nix',
      pending: true,
      profilePicture: 'duplicate_',
      publicKey: 'duplicate_NoWiFi4you',
      state: 'online',
      status: 'duplicate_',
      textilePubkey:
        'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
      unreadCount: 123,
      userAccount: 'duplicate_',
    })
  })
  test('module.default.friendExists', () => {
    const localState: FriendsState = { ...initialFriendsState }
    const originalFunction = module.default.friendExists(localState)
    const result = originalFunction(
      // We have to call the function this way because of how it was declared in ./getters.ts
      '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    )
    expect(result).toBeTruthy()
  })
  test('module.default.matchesActiveCall', () => {
    const localState: FriendsState = { ...initialFriendsState }
    const localRootState: RootState = { ...initialRootState }
    localState.all[0].address = 'peer_1234' // So that (friend.address === rootState.webrtc.activeCall?.peerId,) is true
    const result = module.default.matchesActiveCall(
      // We have to call the function this way because of how it was declared in ./getters.ts
      localState,
      {}, // Empty object as dummy argument for FriendsGetters
      localRootState,
    )
    expect(result).toEqual({
      account: {
        accountId: 'Checking Account',
        from: '.',
        fromMailboxId: '12345',
        status: 429,
        to: './path/to/file',
        toMailboxId: 'v4.0.0-rc.4',
      },
      activeChat: true,
      address: 'peer_1234',
      badge: 'community',
      encryptedTextilePubkey: '',
      item: {},
      localSypingState: 'NOT_TYPING',
      mailboxId: '',
      name: 'Taurus Nix',
      pending: true,
      profilePicture: '',
      publicKey: 'NoWiFi4you',
      state: 'idle',
      status: '',
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
      unreadCount: 123,
      userAccount: '',
    })
  })
  test('module.default.matchesSomeActiveCall', () => {
    const localState: FriendsState = { ...initialFriendsState }
    const localRootState: RootState = { ...initialRootState }
    localState.all[0].address = 'peer_1234' // So that (friend.address === rootState.webrtc.activeCall?.peerId,) is true
    const result = module.default.matchesSomeActiveCall(
      // We have to call the function this way because of how it was declared in ./getters.ts
      localState,
      {}, // Empty object as dummy argument for FriendsGetters
      localRootState,
    )
    expect(result).toBeTruthy()
  })
  test('module.default.alphaSortedFriends', () => {
    const localState: FriendsState = { ...initialFriendsState }
    localState.all.push({
      publicKey: 'duplicate_NoWiFi4you',
      localSypingState: 'NOT_TYPING',
      item: {},
      pending: true,
      activeChat: true,
      encryptedTextilePubkey: 'duplicate_',
      name: 'duplicate_Taurus Nix',
      address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      account: {
        accountId: 'duplicate_Checking Account',
        from: 'duplicate_.',
        status: 429,
        fromMailboxId: 'duplicate_12345',
        toMailboxId: 'duplicate_v4.0.0-rc.4',
        to: 'duplicate_./path/to/file',
      },
      textilePubkey:
        'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
      status: 'duplicate_',
      state: 'online', // Duplicate entry: changed from idle to online
      unreadCount: 123,
      profilePicture: 'duplicate_',
      badge: 'community',
      userAccount: 'duplicate_',
      mailboxId: 'duplicate_',
    })
    const result = module.default.alphaSortedFriends(localState)
    expect(result).toEqual({
      D: [
        {
          account: {
            accountId: 'duplicate_Checking Account',
            from: 'duplicate_.',
            fromMailboxId: 'duplicate_12345',
            status: 429,
            to: 'duplicate_./path/to/file',
            toMailboxId: 'duplicate_v4.0.0-rc.4',
          },
          activeChat: true,
          address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          badge: 'community',
          encryptedTextilePubkey: 'duplicate_',
          item: {},
          localSypingState: 'NOT_TYPING',
          mailboxId: 'duplicate_',
          name: 'duplicate_Taurus Nix',
          pending: true,
          profilePicture: 'duplicate_',
          publicKey: 'duplicate_NoWiFi4you',
          state: 'online',
          status: 'duplicate_',
          textilePubkey:
            'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
          unreadCount: 123,
          userAccount: 'duplicate_',
        },
        {
          account: {
            accountId: 'duplicate_Checking Account',
            from: 'duplicate_.',
            fromMailboxId: 'duplicate_12345',
            status: 429,
            to: 'duplicate_./path/to/file',
            toMailboxId: 'duplicate_v4.0.0-rc.4',
          },
          activeChat: true,
          address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          badge: 'community',
          encryptedTextilePubkey: 'duplicate_',
          item: {},
          localSypingState: 'NOT_TYPING',
          mailboxId: 'duplicate_',
          name: 'duplicate_Taurus Nix',
          pending: true,
          profilePicture: 'duplicate_',
          publicKey: 'duplicate_NoWiFi4you',
          state: 'online',
          status: 'duplicate_',
          textilePubkey:
            'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
          unreadCount: 123,
          userAccount: 'duplicate_',
        },
      ],
      T: [
        {
          account: {
            accountId: 'Checking Account',
            from: '.',
            fromMailboxId: '12345',
            status: 429,
            to: './path/to/file',
            toMailboxId: 'v4.0.0-rc.4',
          },
          activeChat: true,
          address: 'peer_1234',
          badge: 'community',
          encryptedTextilePubkey: '',
          item: {},
          localSypingState: 'NOT_TYPING',
          mailboxId: '',
          name: 'Taurus Nix',
          pending: true,
          profilePicture: '',
          publicKey: 'NoWiFi4you',
          state: 'idle',
          status: '',
          textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
          unreadCount: 123,
          userAccount: '',
        },
      ],
    })
  })
  test('module.default.alphaSortedOutgoing', () => {
    const localState: FriendsState = { ...initialFriendsState }
    localState.all.push({
      publicKey: 'duplicate_NoWiFi4you',
      localSypingState: 'NOT_TYPING',
      item: {},
      pending: true,
      activeChat: true,
      encryptedTextilePubkey: 'duplicate_',
      name: 'duplicate_Taurus Nix',
      address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      account: {
        accountId: 'duplicate_Checking Account',
        from: 'duplicate_.',
        status: 429,
        fromMailboxId: 'duplicate_12345',
        toMailboxId: 'duplicate_v4.0.0-rc.4',
        to: 'duplicate_./path/to/file',
      },
      textilePubkey:
        'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
      status: 'duplicate_',
      state: 'online', // Duplicate entry: changed from idle to online
      unreadCount: 123,
      profilePicture: 'duplicate_',
      badge: 'community',
      userAccount: 'duplicate_',
      mailboxId: 'duplicate_',
    })
    const result = module.default.alphaSortedOutgoing(localState)
    expect(result).toEqual([
      {
        account: {
          accountId: '',
          from: '',
          fromMailboxId: '',
          status: 123,
          to: '',
          toMailboxId: '',
        },
        pending: true,
        requestId: '',
        to: '',
        userInfo: {
          address: 'a',
          bannerImageHash: 'a',
          extra1: 'a',
          extra2: 'a',
          name: 'a',
          photoHash: 'a',
          status: 'a',
        },
      },
      {
        account: {
          accountId: '',
          from: '',
          fromMailboxId: '',
          status: 123,
          to: '',
          toMailboxId: '',
        },
        pending: true,
        requestId: '',
        to: '',
        userInfo: {
          address: 'b',
          bannerImageHash: 'b',
          extra1: 'b',
          extra2: 'b',
          name: 'b',
          photoHash: 'b',
          status: 'b',
        },
      },
    ])
  })
  test('module.default.friendsWithUnreadMessages', () => {
    const localState: FriendsState = { ...initialFriendsState }
    const result = module.default.friendsWithUnreadMessages(localState)
    expect(result).toEqual([
      {
        account: {
          accountId: 'Checking Account',
          from: '.',
          fromMailboxId: '12345',
          status: 429,
          to: './path/to/file',
          toMailboxId: 'v4.0.0-rc.4',
        },
        activeChat: true,
        address: 'peer_1234',
        badge: 'community',
        encryptedTextilePubkey: '',
        item: {},
        localSypingState: 'NOT_TYPING',
        mailboxId: '',
        name: 'Taurus Nix',
        pending: true,
        profilePicture: '',
        publicKey: 'NoWiFi4you',
        state: 'idle',
        status: '',
        textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        unreadCount: 123,
        userAccount: '',
      },
      {
        account: {
          accountId: 'duplicate_Checking Account',
          from: 'duplicate_.',
          fromMailboxId: 'duplicate_12345',
          status: 429,
          to: 'duplicate_./path/to/file',
          toMailboxId: 'duplicate_v4.0.0-rc.4',
        },
        activeChat: true,
        address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
        badge: 'community',
        encryptedTextilePubkey: 'duplicate_',
        item: {},
        localSypingState: 'NOT_TYPING',
        mailboxId: 'duplicate_',
        name: 'duplicate_Taurus Nix',
        pending: true,
        profilePicture: 'duplicate_',
        publicKey: 'duplicate_NoWiFi4you',
        state: 'online',
        status: 'duplicate_',
        textilePubkey:
          'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
        unreadCount: 123,
        userAccount: 'duplicate_',
      },
      {
        account: {
          accountId: 'duplicate_Checking Account',
          from: 'duplicate_.',
          fromMailboxId: 'duplicate_12345',
          status: 429,
          to: 'duplicate_./path/to/file',
          toMailboxId: 'duplicate_v4.0.0-rc.4',
        },
        activeChat: true,
        address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
        badge: 'community',
        encryptedTextilePubkey: 'duplicate_',
        item: {},
        localSypingState: 'NOT_TYPING',
        mailboxId: 'duplicate_',
        name: 'duplicate_Taurus Nix',
        pending: true,
        profilePicture: 'duplicate_',
        publicKey: 'duplicate_NoWiFi4you',
        state: 'online',
        status: 'duplicate_',
        textilePubkey:
          'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
        unreadCount: 123,
        userAccount: 'duplicate_',
      },
      {
        account: {
          accountId: 'duplicate_Checking Account',
          from: 'duplicate_.',
          fromMailboxId: 'duplicate_12345',
          status: 429,
          to: 'duplicate_./path/to/file',
          toMailboxId: 'duplicate_v4.0.0-rc.4',
        },
        activeChat: true,
        address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
        badge: 'community',
        encryptedTextilePubkey: 'duplicate_',
        item: {},
        localSypingState: 'NOT_TYPING',
        mailboxId: 'duplicate_',
        name: 'duplicate_Taurus Nix',
        pending: true,
        profilePicture: 'duplicate_',
        publicKey: 'duplicate_NoWiFi4you',
        state: 'online',
        status: 'duplicate_',
        textilePubkey:
          'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
        unreadCount: 123,
        userAccount: 'duplicate_',
      },
    ])
  })
  test('module.default.alphaSortedFriendsSearch', () => {
    const localState: FriendsState = { ...initialFriendsState }
    localState.all.push({
      publicKey: 'duplicate_NoWiFi4you',
      localSypingState: 'NOT_TYPING',
      item: {},
      pending: true,
      activeChat: true,
      encryptedTextilePubkey: 'duplicate_',
      name: 'duplicate_Taurus Nix',
      address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      account: {
        accountId: 'duplicate_Checking Account',
        from: 'duplicate_.',
        status: 429,
        fromMailboxId: 'duplicate_12345',
        toMailboxId: 'duplicate_v4.0.0-rc.4',
        to: 'duplicate_./path/to/file',
      },
      textilePubkey:
        'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
      status: 'duplicate_',
      state: 'online', // Duplicate entry: changed from idle to online
      unreadCount: 123,
      profilePicture: 'duplicate_',
      badge: 'community',
      userAccount: 'duplicate_',
      mailboxId: 'duplicate_',
    })
    const originalFunction = module.default.alphaSortedFriendsSearch(localState)
    const result = originalFunction('duplicate_Taurus Nix')
    expect(result).toEqual({
      D: [
        {
          account: {
            accountId: 'duplicate_Checking Account',
            from: 'duplicate_.',
            fromMailboxId: 'duplicate_12345',
            status: 429,
            to: 'duplicate_./path/to/file',
            toMailboxId: 'duplicate_v4.0.0-rc.4',
          },
          activeChat: true,
          address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          badge: 'community',
          encryptedTextilePubkey: 'duplicate_',
          item: {},
          localSypingState: 'NOT_TYPING',
          mailboxId: 'duplicate_',
          name: 'duplicate_Taurus Nix',
          pending: true,
          profilePicture: 'duplicate_',
          publicKey: 'duplicate_NoWiFi4you',
          state: 'online',
          status: 'duplicate_',
          textilePubkey:
            'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
          unreadCount: 123,
          userAccount: 'duplicate_',
        },
        {
          account: {
            accountId: 'duplicate_Checking Account',
            from: 'duplicate_.',
            fromMailboxId: 'duplicate_12345',
            status: 429,
            to: 'duplicate_./path/to/file',
            toMailboxId: 'duplicate_v4.0.0-rc.4',
          },
          activeChat: true,
          address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          badge: 'community',
          encryptedTextilePubkey: 'duplicate_',
          item: {},
          localSypingState: 'NOT_TYPING',
          mailboxId: 'duplicate_',
          name: 'duplicate_Taurus Nix',
          pending: true,
          profilePicture: 'duplicate_',
          publicKey: 'duplicate_NoWiFi4you',
          state: 'online',
          status: 'duplicate_',
          textilePubkey:
            'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
          unreadCount: 123,
          userAccount: 'duplicate_',
        },
        {
          account: {
            accountId: 'duplicate_Checking Account',
            from: 'duplicate_.',
            fromMailboxId: 'duplicate_12345',
            status: 429,
            to: 'duplicate_./path/to/file',
            toMailboxId: 'duplicate_v4.0.0-rc.4',
          },
          activeChat: true,
          address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          badge: 'community',
          encryptedTextilePubkey: 'duplicate_',
          item: {},
          localSypingState: 'NOT_TYPING',
          mailboxId: 'duplicate_',
          name: 'duplicate_Taurus Nix',
          pending: true,
          profilePicture: 'duplicate_',
          publicKey: 'duplicate_NoWiFi4you',
          state: 'online',
          status: 'duplicate_',
          textilePubkey:
            'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
          unreadCount: 123,
          userAccount: 'duplicate_',
        },
        {
          account: {
            accountId: 'duplicate_Checking Account',
            from: 'duplicate_.',
            fromMailboxId: 'duplicate_12345',
            status: 429,
            to: 'duplicate_./path/to/file',
            toMailboxId: 'duplicate_v4.0.0-rc.4',
          },
          activeChat: true,
          address: 'duplicate_0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
          badge: 'community',
          encryptedTextilePubkey: 'duplicate_',
          item: {},
          localSypingState: 'NOT_TYPING',
          mailboxId: 'duplicate_',
          name: 'duplicate_Taurus Nix',
          pending: true,
          profilePicture: 'duplicate_',
          publicKey: 'duplicate_NoWiFi4you',
          state: 'online',
          status: 'duplicate_',
          textilePubkey:
            'duplicate_https://accounts.google.com/o/oauth2/revoke?token=%s',
          unreadCount: 123,
          userAccount: 'duplicate_',
        },
      ],
    })
  })
})
