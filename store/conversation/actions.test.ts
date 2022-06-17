import { createFromPubKey } from 'peer-id'
import { ConversationActivity, ConversationConnection } from './types'
import { RegistrationStatus } from '~/store/accounts/types'
import * as actions from '~/store/conversation/actions'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { RootState } from '~/types/store/store'

jest.mock('peer-id')
createFromPubKey.mockImplementation(() => 'testpubkey')

describe('actions.default.initialize', () => {
  test('0', () => {
    const result: any = actions.default.initialize({
      commit: () =>
        'commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n',
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = actions.default.initialize({
      commit: () =>
        'commit 380428b6b61b64631d941b27db3e91df27bfff8e\r\nAuthor: Lera Swift <Lela.Lubowitz@yahoo.com>\r\nDate: Wed Jul 28 2021 23:21:29 GMT+0200 (Central European Summer Time)\r\n\r\n    reboot digital application\r\n',
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = actions.default.initialize({
      commit: () =>
        'commit e6d1117d97e7cc250166120d2eee1c2662c58150\r\nAuthor: Keagan Cole <Crystal69@gmail.com>\r\nDate: Thu Jul 29 2021 05:36:16 GMT+0200 (Central European Summer Time)\r\n\r\n    override wireless alarm\r\n',
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = actions.default.initialize({
      commit: () =>
        'commit d3f6bf9bcee016096098e88aced2d5afdc68c424\r\nAuthor: Edna Rice <Shanie.Pagac@yahoo.com>\r\nDate: Wed Jul 28 2021 22:05:49 GMT+0200 (Central European Summer Time)\r\n\r\n    bypass cross-platform hard drive\r\n',
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = actions.default.initialize({
      commit: () =>
        'commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n',
    })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = actions.default.initialize({ commit: () => '' })
    expect(result).toMatchSnapshot()
  })
})

describe('actions.default.setConversation', () => {
  test('0', () => {
    const result: any = actions.default.setConversation(
      {
        commit: () =>
          'commit d3f6bf9bcee016096098e88aced2d5afdc68c424\r\nAuthor: Edna Rice <Shanie.Pagac@yahoo.com>\r\nDate: Wed Jul 28 2021 22:05:49 GMT+0200 (Central European Summer Time)\r\n\r\n    bypass cross-platform hard drive\r\n',
      },
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = actions.default.setConversation(
      {
        commit: () =>
          'commit e6d1117d97e7cc250166120d2eee1c2662c58150\r\nAuthor: Keagan Cole <Crystal69@gmail.com>\r\nDate: Thu Jul 29 2021 05:36:16 GMT+0200 (Central European Summer Time)\r\n\r\n    override wireless alarm\r\n',
      },
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = actions.default.setConversation(
      {
        commit: () =>
          'commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n',
      },
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = actions.default.setConversation(
      {
        commit: () =>
          'commit 380428b6b61b64631d941b27db3e91df27bfff8e\r\nAuthor: Lera Swift <Lela.Lubowitz@yahoo.com>\r\nDate: Wed Jul 28 2021 23:21:29 GMT+0200 (Central European Summer Time)\r\n\r\n    reboot digital application\r\n',
      },
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = actions.default.setConversation(
      { commit: () => '' },
      '',
    )
    expect(result).toMatchSnapshot()
  })
})

describe('misc', () => {
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
  test('actions.default.setCalling true', () => {
    const commit = jest.fn()
    const argument = true

    actions.default.setCalling({ commit }, argument)
    expect(commit).toHaveBeenCalledWith('setCalling', true)
  })
  test('actions.default.setCalling false', () => {
    const commit = jest.fn()
    const argument = false

    actions.default.setCalling({ commit }, argument)
    expect(commit).toHaveBeenCalledWith('setCalling', false)
  })
  test('actions.default.addParticipants 2 entry', () => {
    const dispatch = jest.fn()
    const participant = {
      peerId: 'peerId',
      address: 'address',
      name: 'name',
      profilePicture: 'profilePicture',
      state: ConversationConnection.CONNECTED,
      activity: ConversationActivity.ACTIVE,
      updatedAt: 123,
    }
    const participant2 = {
      peerId: 'peerId2',
      address: 'address2',
      name: 'name2',
      profilePicture: 'profilePicture2',
      state: ConversationConnection.CONNECTED,
      activity: ConversationActivity.ACTIVE,
      updatedAt: 123,
    }
    const argument: string[] = [participant.address, participant2.address]

    actions.default.addParticipants({ dispatch }, argument)
    expect(dispatch).toHaveBeenCalledWith('addParticipant', participant.address)
    expect(dispatch).toHaveBeenCalledWith(
      'addParticipant',
      participant2.address,
    )
  })
  test('actions.default.addParticipant', () => {
    const commit = jest.fn()
    const rootState = { ...initialRootState }
    const state = { ...initialRootState.conversation }
    const argument = 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi'

    actions.default.addParticipant({ commit, state, rootState }, argument)
    expect(commit).toHaveBeenCalledWith('updateParticipant', {
      address: 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi',
      name: 'Taurus Nix',
      peerId: 'peerId2',
      profilePicture: 'profilePicture2',
      state: 'DISCONNECTED',
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
      activity: ConversationActivity.NOT_TYPING,
    })
  })
  test.skip('actions.default.addParticipant no peer id', () => {
    const commit = jest.fn()
    const rootState = { ...initialRootState }
    const state = { ...initialRootState.conversation }
    state.participants[0].peerId = null
    const argument = 'text' // How to pass correct argument? Right now error is: nvalid public key input

    actions.default.addParticipant({ commit, state, rootState }, argument)
    expect(commit).toHaveBeenCalledWith('updateParticipant', {
      address: 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi',
      name: 'Taurus Nix',
      peerId: 'peerId2',
      profilePicture: 'profilePicture2',
      state: 'DISCONNECTED',
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
    })
  })
})
