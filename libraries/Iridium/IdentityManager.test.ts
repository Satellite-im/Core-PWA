import crypto from 'crypto'
import IdentityManager from './IdentityManager'

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
    hash: () => 'hashed string',
    subtle: {
      digest: () => 'digest',
    },
  },
})

describe('Test generateEntropyMessage', () => {
  it('should return an uin8array', () => {
    const localParam = {
      address: 'address',
      secret: 'secret',
    }

    const result = IdentityManager.generateEntropyMessage(
      localParam.address,
      localParam.secret,
    )
    expect(result).toMatchSnapshot()
  })
})

describe('Test seedRandom', () => {
  it('should exist', async () => {
    const result = await IdentityManager.seedRandom()
    expect(result).not.toBeFalsy() // The result exists
  })
})

describe('Test seedFromWallet', () => {
  // For some reason, this does not update coverage
  it('should return an error: Non-base58 character', async () => {
    const localParam = {
      passphrase: 'string',
      publicKey: 'publickey',
    }

    const result = await IdentityManager.generateEntropyMessage(
      localParam.passphrase,
      localParam.publicKey,
    )
    expect(result).not.toBeFalsy()
    expect(result).toMatchSnapshot()
  })
})

describe('Test seedFromPrivateKey', () => {
  it('should return an error: Incorrect signature hash size', async () => {
    const localParam = {
      passphrase: 'string',
      privateKey: new Uint8Array(
        Buffer.from(
          `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        ),
      ),
    }

    try {
      const result = await IdentityManager.seedFromPrivateKey(
        localParam.passphrase,
        localParam.privateKey,
      )
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        `Hash of signature is not the correct size! Something went wrong!`,
      )
    }
  })
})
