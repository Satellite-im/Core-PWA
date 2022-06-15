import Vue from 'vue'
import { AccountsError } from '../accounts/types'
import * as module from './actions'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import FriendsProgram from '~/libraries/Solana/FriendsProgram/FriendsProgram'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { DataStateType } from '~/store/dataState/types'
import BlockchainClient from '~/libraries/BlockchainClient'

jest.genMockFromModule('~/libraries/Solana/FriendsProgram/FriendsProgram')
jest.mock('~/libraries/Solana/FriendsProgram/FriendsProgram')

const mockFPLogger = {
  removeFriend: jest.fn().mockImplementation(() => true),
}

FriendsProgram.mockImplementation(() => mockFPLogger)

Vue.prototype.$SolanaManager = new SolanaManager()

describe('default functions', () => {
  test('module.default.initialize', async () => {
    const mockData = [
      {
        key: '1',
        lastInbound: 1,
      },
      {
        key: '2',
        lastInbound: 2,
      },
    ]
    db.friends = jest.fn()
    db.friends.toArray = jest.fn().mockImplementationOnce(() => {
      return mockData
    })
    db.search = jest.fn()
    db.search.friends = jest.fn()
    db.search.friends.update = jest.fn().mockReturnValueOnce(true)

    const dispatch = jest.fn()
    const commit = jest.fn()
    const state = {
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

    await module.default.initialize({ dispatch, commit, state })

    expect(commit).toBeCalledWith(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Loading },
      { root: true },
    )
    expect(commit).toBeCalledWith(
      'dataState/setDataState',
      { key: 'friends', value: DataStateType.Ready },
      { root: true },
    )

    expect(dispatch).toBeCalledWith('fetchFriends', {})
    expect(dispatch).toBeCalledWith('fetchFriendRequests', {})
    expect(dispatch).toBeCalledWith('subscribeToFriendsEvents', {})
  })
  test('module.default.removeFriend without payer account', async () => {
    const BCConstructor = BlockchainClient
    BCConstructor.getInstance = jest.fn().mockReturnValueOnce({
      payerAccount: false,
    })

    const dispatch = jest.fn()
    const commit = jest.fn()
    const state = {
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

    await module.default.initialize({ dispatch, commit, state })
    const SMConstructor = Vue.prototype.$SolanaManager
    SMConstructor.getActiveAccount = jest.fn().mockReturnValueOnce(false)

    try {
      await module.default.removeFriend(
        { commit },
        {
          publicKey: '!Lov3MyPianoPony',
          typingState: 'NOT_TYPING',
          textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
          item: '["a", "b", "043", "holasenior"]',
          pending: false,
          activeChat: true,
          account: {
            accountId: 'Credit Card Account',
            from: 'C:\\\\path\\to\\file.ext',
            status: 404,
            fromMailboxId: 'c466a48309794261b64a4f02cfcc3d64',
            toMailboxId: '1.0.0',
            to: '.',
          },
          encryptedTextilePubkey: 'v1.2.4',
          name: 'Michael',
          address: '0.0.0.0',
          status: 'done',
          state: 'online',
          unreadCount: undefined,
          profilePicture: 'http://placeimg.com/640/480',
          badge: 'cameraman',
          userAccount: '07981006',
          mailboxId: 'c466a48309794261b64a4f02cfcc3d64',
        },
      )
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.PAYER_NOT_PRESENT)
    }
  })
  test.skip('module.default.removeFriend with payer account', async () => {
    const SMConstructor = Vue.prototype.$SolanaManager
    SMConstructor.getActiveAccount = jest.fn().mockReturnValueOnce(true) // this is the payer account

    const commit = jest.fn()
    await module.default.removeFriend(
      { commit },
      {
        publicKey: '!Lov3MyPianoPony',
        typingState: 'NOT_TYPING',
        textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        item: '["a", "b", "043", "holasenior"]',
        pending: false,
        activeChat: true,
        account: {
          accountId: 'Credit Card Account',
          from: 'C:\\\\path\\to\\file.ext',
          status: 404,
          fromMailboxId: 'c466a48309794261b64a4f02cfcc3d64',
          toMailboxId: '1.0.0',
          to: '.',
        },
        encryptedTextilePubkey: 'v1.2.4',
        name: 'Michael',
        address: '0.0.0.0',
        status: 'done',
        state: 'online',
        unreadCount: undefined,
        profilePicture: 'http://placeimg.com/640/480',
        badge: 'cameraman',
        userAccount: '07981006',
        mailboxId: 'c466a48309794261b64a4f02cfcc3d64',
      },
    )
    expect(commit).toHaveBeenCalledWith('removeFriend', '0.0.0.0') // the second argument here can be seen in the huge chunk of line above this line
  })
})

describe('utility functions', () => {
  test('module.exportForTesting.friendAccountToIncomingRequest', () => {
    const friendAccount = {
      accountId: 'Checking Account',
      from: '.',
      status: 429,
      fromMailboxId: '12345',
      toMailboxId: 'v4.0.0-rc.4',
      to: './path/to/file',
    }
    const userInfo = null

    const result = module.exportForTesting.friendAccountToIncomingRequest(
      friendAccount,
      userInfo,
    )
    expect(result.account).toEqual(friendAccount)
  })
  test('module.exportForTesting.friendAccountToOutgoingRequest', () => {
    const friendAccount = {
      accountId: 'Checking Account',
      from: '.',
      status: 429,
      fromMailboxId: '12345',
      toMailboxId: 'v4.0.0-rc.4',
      to: './path/to/file',
    }
    const userInfo = null

    const result = module.exportForTesting.friendAccountToOutgoingRequest(
      friendAccount,
      userInfo,
    )
    expect(result.account).toEqual(friendAccount)
  })
})
