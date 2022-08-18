import { expect } from '@jest/globals'
import { MessagingTypesEnum, PropCommonEnum } from '~/libraries/Enums/enums'
import { RegistrationStatus } from '~/store/accounts/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { UIReply } from '~/types/messaging'
import * as Messaging from '~/utilities/Messaging'

Date.now = jest.fn(() => 1656069280)
const dateNow = Date.now()

const initialRootState: any = {
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
}

describe('', () => {
  test('getFullUserInfoFromState with identical textile public key', () => {
    const rootStateForTest = { ...initialRootState }
    const publicKeyForTest = 'publickey1'
    rootStateForTest.accounts.details.textilePubkey = publicKeyForTest

    const result = Messaging.getFullUserInfoFromState(
      publicKeyForTest,
      rootStateForTest,
    )

    expect(result).toBe(rootStateForTest.accounts.details)
  })

  test('getFullUserInfoFromState with non-identical textile public key', () => {
    const rootStateForTest = { ...initialRootState }
    const publicKeyForTest =
      'https://accounts.google.com/o/oauth2/revoke?token=%s'
    rootStateForTest.accounts.details.textilePubkey = 'publickey1'

    const result = Messaging.getFullUserInfoFromState(
      publicKeyForTest,
      rootStateForTest,
    )

    expect(result).toMatchObject({
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
    })
  })

  test('getUsernameFromState with unknown textile public key', () => {
    const rootStateForTest = { ...initialRootState }
    const publicKeyForTest = 'publickey1'
    rootStateForTest.accounts.details.textilePubkey = publicKeyForTest

    const result = Messaging.getUsernameFromState(
      publicKeyForTest,
      rootStateForTest,
    )

    expect(result).toBe(PropCommonEnum.UNKNOWN)
  })

  test('getAddressFromState with unknown textile public key', () => {
    const rootStateForTest = { ...initialRootState }
    const publicKeyForTest = 'publickey1'
    rootStateForTest.accounts.details.textilePubkey = publicKeyForTest

    const result = Messaging.getAddressFromState(
      publicKeyForTest,
      rootStateForTest,
    )

    expect(result).toBe(PropCommonEnum.UNKNOWN)
  })

  test('refreshTimeStampInterval', () => {
    jest.useFakeTimers()
    const action = jest.fn()
    const result1 = Messaging.refreshTimestampInterval(123, action, 3000)
    expect(result1).toBe(1000000000000)
    const result2 = Messaging.refreshTimestampInterval(135, action, 3000)
    expect(result2).toBe(1000000000001)
  })

  test('replyMessageToUIReply', () => {
    const result: UIReply = Messaging.exportedForTesting.replyMessageToUIReply(
      [
        {
          replyMessage: 'text1',
          reactionMessage: '',
          fileMessage: '',
          textMessage: '',
          mediaMessage: '',
          glyphMessage: '',
          type: MessagingTypesEnum.TEXT,
        },
      ],
      [
        {
          payload: 'payload1',
          reactedTo: 'react1',
        },
        {
          payload: 'payload2',
          reactedTo: 'react2',
        },
      ],
    )
    expect(result).toMatchSnapshot()
  })

  test('messageRepliesToUIReplies', () => {
    const result = Messaging.exportedForTesting.messageRepliesToUIReplies(
      [
        {
          replyMessage: 'text1',
          reactionMessage: '',
          fileMessage: '',
          textMessage: '',
          mediaMessage: '',
          glyphMessage: '',
          type: MessagingTypesEnum.TEXT,
        },
        {
          replyMessage: 'text2',
          reactionMessage: '',
          fileMessage: '',
          textMessage: '',
          mediaMessage: '',
          glyphMessage: '',
          type: MessagingTypesEnum.TEXT,
        },
      ],
      [
        {
          payload: 'payload1',
          reactedTo: 'react1',
        },
        {
          payload: 'payload2',
          reactedTo: 'react2',
        },
      ],
    )
    expect(result).toMatchSnapshot()
  })

  test('groupMessages', () => {
    const message1 = `message1`
    const message2 = `message2`
    const reaction1 = `reaction1`
    const result = Messaging.groupMessages(
      {
        [message1]: {
          id: 'string123',
          at: 123,
          from: 'string',
          to: 'string',
          type: MessagingTypesEnum.TEXT,
        },
        [message2]: {
          id: 'string125',
          at: 125,
          from: 'string',
          to: 'string',
          type: MessagingTypesEnum.TEXT,
        },
      },
      {
        replyMessage: 'text1',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
        type: MessagingTypesEnum.TEXT,
      },
      {
        [reaction1]: {
          id: 'reaction123',
          at: 123,
          from: 'reaction',
          to: 'reaction',
          type: MessagingTypesEnum.TEXT,
        },
      },
    )
  })
})

describe('update message tracker', () => {
  test('updateMessageTracker glyph', () => {
    const newMessages = [
      {
        replyMessage: 'text0',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
      },
      {
        replyMessage: 'text1',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
        type: MessagingTypesEnum.GLYPH,
      },
    ]
    const result = Messaging.updateMessageTracker(newMessages)
    expect(result).toMatchSnapshot()
  })

  test('updateMessageTracker text', () => {
    const newMessages = [
      {
        replyMessage: 'text0',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
      },
      {
        replyMessage: 'text1',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
        type: MessagingTypesEnum.TEXT,
      },
    ]
    const result = Messaging.updateMessageTracker(newMessages)
    expect(result).toMatchSnapshot()
  })

  test('updateMessageTracker file', () => {
    const newMessages = [
      {
        replyMessage: 'text0',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
      },
      {
        replyMessage: 'text1',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
        type: MessagingTypesEnum.FILE,
      },
    ]
    const result = Messaging.updateMessageTracker(newMessages)
    expect(result).toMatchSnapshot()
  })

  test('updateMessageTracker reaction', () => {
    const newMessages = [
      {
        replyMessage: 'text0',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
      },
      {
        replyMessage: 'text1',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
        type: MessagingTypesEnum.REACTION,
      },
    ]
    const result = Messaging.updateMessageTracker(newMessages)
    expect(result).toMatchSnapshot()
  })

  test('updateMessageTracker reply', () => {
    const newMessages = [
      {
        replyMessage: 'text0',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
      },
      {
        replyMessage: 'text1',
        reactionMessage: '',
        fileMessage: '',
        textMessage: '',
        mediaMessage: '',
        glyphMessage: '',
        type: MessagingTypesEnum.REPLY,
      },
    ]
    const result = Messaging.updateMessageTracker(newMessages)
    expect(result).toMatchSnapshot()
  })

  test('convertTimestampToDate', () => {
    const localTimestamp = dateNow
    const result = Messaging.convertTimestampToDate(
      {
        now: 'now',
        yesterday: 'yesterday',
        days_short: 'd',
        no_message: 'no message',
      },
      localTimestamp,
    )
    expect(result).toMatchSnapshot()
  })
})
