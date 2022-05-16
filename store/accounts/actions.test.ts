import * as web3 from '@solana/web3.js'
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import Vue from 'vue'
import { AccountsError, RegistrationStatus } from './types'
import { DataStateType } from '~/store/dataState/types'
import { Config } from '~/config'
import Crypto from '~/libraries/Crypto/Crypto'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import TextileManager from '~/libraries/Textile/TextileManager'
import * as accounts from '~/store/accounts/actions'
import InitialAccountsState from '~/store/accounts/state'

Vue.prototype.$Config = Config
Vue.prototype.$TextileManager = new TextileManager()
Vue.prototype.$Crypto = new Crypto()
Vue.prototype.$SolanaManager = new SolanaManager()

enableFetchMocks()

describe('init', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })
  test('setPin with 5 letter', async () => {
    const CPrototype = Vue.prototype.$Crypto

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    await accounts.default.setPin({ commit }, '12345')
    expect(CPrototype.hash).toHaveBeenCalled()
    expect(CPrototype.hash).toHaveBeenCalledWith('12345')
    expect(commit).toHaveBeenCalledWith('setPin', '12345')
  })
  test('setPin with less than 5 letter', async () => {
    const CPrototype = Vue.prototype.$Crypto

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    try {
      await accounts.default.setPin({ commit }, '123')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.PIN_TOO_SHORT)
    }
  })
  test('unlock with non-matching pinHash', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    state.pinHash =
      '3b4557f45660ca5364013a84dc2dce7d08ab991976a6ef81bdaa4c289997f6cb'
    state.phrase = 'mnemonic string'
    state.encryptedPhrase = ''

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    await expect(async () => {
      await accounts.default.unlock({ commit, state }, state.pin)
    }).rejects.toThrowError(AccountsError.INVALID_PIN)
  })
  test('unlock with 3 length pin', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = {
      storePin: false,
      locked: false,
      error: '',
      pinHash:
        'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
      active: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
      gasPrice: '',
      phrase:
        'flip use save jealous brass link card express degree tip cube flame',
      encryptedPhrase:
        'AhJ3ybxW6ZnjiX5RSoNUXGvDVkMRFHiMYeYTvgkBMUETCK3YoCmBRnGFQfbM0sCsWJauMUFvIIxucgDbrLcYK5PK/rL00VBlLilQp1dZwGfiEGrE0br4DTWCjkvefwtL',
      loading: false,
      registered: false,
      registrationStatus: 'unknown',
      lastVisited: '/chat/direct/HFi9WT7vwxhDBi2MNfGUkrCrQrUkVdDKjuhix1RwnVG7',
      details: {
        address: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
        name: 'asdasdsa',
        profilePicture: '',
        state: 'online',
        status: 'dasdad',
        textilePubkey:
          'bbaareifiszb2kb2mejsgng4d52g2y2fxxuhhgnblixjqsvdatptpn7t6dy',
      },
      pin: '?{fD', // length is 3, rather than the minimum that is 5
    }

    const commit = jest.fn()
    CPrototype.hash = jest.fn()

    const result = async () => {
      await accounts.default.unlock({ commit, state }, state.pin)
    }

    expect(result).rejects.toThrowError(AccountsError.PIN_TOO_SHORT)
  })
  test('unlock with set phrase', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = {
      storePin: false,
      locked: false,
      error: '',
      pinHash:
        'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
      active: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
      gasPrice: '',
      phrase:
        'flip use save jealous brass link card express degree tip cube flame',
      encryptedPhrase:
        'AhJ3ybxW6ZnjiX5RSoNUXGvDVkMRFHiMYeYTvgkBMUETCK3YoCmBRnGFQfbM0sCsWJauMUFvIIxucgDbrLcYK5PK/rL00VBlLilQp1dZwGfiEGrE0br4DTWCjkvefwtL',
      loading: false,
      registered: false,
      registrationStatus: 'unknown',
      lastVisited: '/chat/direct/HFi9WT7vwxhDBi2MNfGUkrCrQrUkVdDKjuhix1RwnVG7',
      details: {
        address: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
        name: 'asdasdsa',
        profilePicture: '',
        state: 'online',
        status: 'dasdad',
        textilePubkey:
          'bbaareifiszb2kb2mejsgng4d52g2y2fxxuhhgnblixjqsvdatptpn7t6dy',
      },
      pin: '?{fDn4s8I5~sb@*F858{]CZ@A',
    }

    const commit = jest.fn()
    // CPrototype.hash = jest.fn()
    // CPrototype.hash.mockReturnValueOnce(
    //   'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
    // )
    // CPrototype.decryptWithPassword = jest.fn()
    // CPrototype.decryptWithPassword.mockReturnValueOnce('decrypted phrase')

    const result = async () => {
      await accounts.default.unlock({ commit, state }, state.pin)
    }

    expect(result).rejects.toThrowError(AccountsError.INVALID_PIN)
  })
  test('loadAccount with empty mnemonic', async () => {
    const state = {
      storePin: false,
      locked: false,
      error: '',
      pinHash:
        'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
      active: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
      gasPrice: '',
      phrase: '', // Empty because this is the mnemonic
      encryptedPhrase:
        'AhJ3ybxW6ZnjiX5RSoNUXGvDVkMRFHiMYeYTvgkBMUETCK3YoCmBRnGFQfbM0sCsWJauMUFvIIxucgDbrLcYK5PK/rL00VBlLilQp1dZwGfiEGrE0br4DTWCjkvefwtL',
      loading: false,
      registered: false,
      registrationStatus: 'unknown',
      lastVisited: '/chat/direct/HFi9WT7vwxhDBi2MNfGUkrCrQrUkVdDKjuhix1RwnVG7',
      details: {
        address: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
        name: 'asdasdsa',
        profilePicture: '',
        state: 'online',
        status: 'dasdad',
        textilePubkey:
          'bbaareifiszb2kb2mejsgng4d52g2y2fxxuhhgnblixjqsvdatptpn7t6dy',
      },
      pin: '?{fDn4s8I5~sb@*F858{]CZ@A',
    }

    const commit = jest.fn()
    const dispatch = jest.fn()

    const result = async () => {
      await accounts.default.loadAccount({ commit, state, dispatch })
    }

    expect(result).rejects.toThrowError(AccountsError.MNEMONIC_NOT_PRESENT)
  })
  test('generate wallet with invalid pin', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const SMPrototype = Vue.prototype.$SolanaManager
    const state = {
      storePin: false,
      locked: false,
      error: '',
      pinHash:
        'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
      active: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
      gasPrice: '',
      phrase:
        'flip use save jealous brass link card express degree tip cube flame',
      encryptedPhrase:
        'AhJ3ybxW6ZnjiX5RSoNUXGvDVkMRFHiMYeYTvgkBMUETCK3YoCmBRnGFQfbM0sCsWJauMUFvIIxucgDbrLcYK5PK/rL00VBlLilQp1dZwGfiEGrE0br4DTWCjkvefwtL',
      loading: false,
      registered: false,
      registrationStatus: 'unknown',
      lastVisited: '/chat/direct/HFi9WT7vwxhDBi2MNfGUkrCrQrUkVdDKjuhix1RwnVG7',
      details: {
        address: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
        name: 'asdasdsa',
        profilePicture: '',
        state: 'online',
        status: 'dasdad',
        textilePubkey:
          'bbaareifiszb2kb2mejsgng4d52g2y2fxxuhhgnblixjqsvdatptpn7t6dy',
      },
      pin: false, // invalid for it is not true
    }

    const commit = jest.fn()
    CPrototype.hash = jest.fn()
    SMPrototype.createRandomKeypair = jest.fn()

    const result = async () => {
      await accounts.default.generateWallet({ commit, state })
    }

    expect(result).rejects.toThrowError(AccountsError.INVALID_PIN)
  })
  test.skip('generate wallet', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const SMPrototype = Vue.prototype.$SolanaManager
    const state = {
      storePin: false,
      locked: false,
      error: '',
      pinHash:
        'fddd5093b61663c64c309a0352b3762e4f6b7277b1ec7f2ac64f4b696c66ab91',
      active: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
      gasPrice: '',
      phrase:
        'flip use save jealous brass link card express degree tip cube flame',
      encryptedPhrase:
        'AhJ3ybxW6ZnjiX5RSoNUXGvDVkMRFHiMYeYTvgkBMUETCK3YoCmBRnGFQfbM0sCsWJauMUFvIIxucgDbrLcYK5PK/rL00VBlLilQp1dZwGfiEGrE0br4DTWCjkvefwtL',
      loading: false,
      registered: false,
      registrationStatus: 'unknown',
      lastVisited: '/chat/direct/HFi9WT7vwxhDBi2MNfGUkrCrQrUkVdDKjuhix1RwnVG7',
      details: {
        address: '4tyqWRnsZ9frgvRusFuTY71MdhHPK8jBiPZAUBfvK31C',
        name: 'asdasdsa',
        profilePicture: '',
        state: 'online',
        status: 'dasdad',
        textilePubkey:
          'bbaareifiszb2kb2mejsgng4d52g2y2fxxuhhgnblixjqsvdatptpn7t6dy',
      },
      pin: '?{fDn4s8I5~sb@*F858{]CZ@A',
    }

    const commit = jest.fn()
    CPrototype.hash = jest.fn()
    SMPrototype.createRandomKeypair = jest.fn()

    const result = async () => {
      await accounts.default.generateWallet({ commit, state })
    }

    expect(result).rejects.toThrowError(AccountsError.INVALID_PIN) // Cannot do anything right now.
    // On the `if (!solanaWallet.mnemonic) {` line, solanaWallet is undefined.
  })
  test('setRecoverMnemonic with a pin', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    const mnemonic = 'mnemonic string'

    const commit = jest.fn()
    CPrototype.encryptWithPassword = jest.fn()

    await accounts.default.setRecoverMnemonic({ commit, state }, mnemonic)
    expect(CPrototype.encryptWithPassword).toHaveBeenCalled()
    expect(CPrototype.encryptWithPassword).toHaveBeenCalledWith(
      mnemonic,
      state.pin,
    )
    expect(commit).toHaveBeenCalledWith('setEncryptedPhrase', undefined)
    // It is undefined because setEncryptedPhrase updates the state, rather than returning any value.
  })
  test('setRecoverMnemonic with an invalid pin', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = ''
    state.loading = false
    const mnemonic = 'mnemonic string'

    const commit = jest.fn()
    CPrototype.encryptWithPassword = jest.fn()

    try {
      await accounts.default.setRecoverMnemonic({ commit, state }, mnemonic)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.INVALID_PIN)
    }
  })
  test('setRecoverMnemonic without a mnemonic', async () => {
    const CPrototype = Vue.prototype.$Crypto
    const state = InitialAccountsState()
    state.pin = '12345'
    state.loading = false
    const mnemonic = ''

    const commit = jest.fn()
    CPrototype.encryptWithPassword = jest.fn()

    try {
      await accounts.default.setRecoverMnemonic({ commit, state }, mnemonic)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        AccountsError.MNEMONIC_NOT_PRESENT,
      )
    }
  })
  test('uploadPicture with an image', async () => {
    /*
     * The comments are here because I am still discussing on how to proceed in testing out the TextileManager on the Vue side. Right now it is about fetch.
     */
    // console.log(Vue.prototype.$TextileManager.bucketManager)
    // const TMPrototype = Vue.prototype.$TextileManager
    // TMPrototype.bucketManager.getBucket = jest.fn()
    // TMPrototype.bucketManager.pushFile = jest.fn()

    const result = await accounts.exportForTesting.uploadPicture(
      'https://drepram.com/assets/favicon.png',
    )
    expect(fetchMock.mock.calls.length).toEqual(1)
    // expect(TMPrototype.bucketManager.getBucket).toHaveBeenCalled()
    // expect(TMPrototype.bucketManager.pushFile).toHaveBeenCalled()
  })
  test('uploadPicture with a non image', async () => {
    const result = await accounts.exportForTesting.uploadPicture(false)
    expect(result).toBe('')
  })
  test('initializeEncryptionEngine', async () => {
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
            textilePubkey:
              'https://accounts.google.com/o/oauth2/revoke?token=%s',
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
      prerequisites: {
        accountsReady: true,
        textileReady: true,
        p2pReady: true,
      },
    }

    const CPrototype = Vue.prototype.$Crypto
    CPrototype.init = jest.fn()
    const result = await accounts.default.initializeEncryptionEngine(
      state,
      web3.Keypair.generate(),
    )
    expect(CPrototype.init).toHaveBeenCalled()
  })
})
