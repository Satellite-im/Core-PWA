import { Keypair } from '@solana/web3.js'
import Crypto from './Crypto'

describe('Test crypto', () => {
  test('Initialize Crypto', () => {
    const exampleKeypair = Keypair.generate()
    const konstruktor = new Crypto()
    konstruktor.init(exampleKeypair)
  })
  test.skip('Initialize Crypto without Keypair', () => {
    const exampleKeypair = {
      publicKey: {
        toBytes: () => true,
      },
      privateKey: null,
    }
    exampleKeypair.privateKey = null

    const konstruktor = new Crypto()
    try {
      konstruktor.init(exampleKeypair)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', `Impossible to convert keypair`)
    }
  })
  test('getPublicKey', () => {
    function toHexString(byteArray: Iterable<unknown> | ArrayLike<unknown>) {
      // From https://stackoverflow.com/a/34310051
      return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xff).toString(16)).slice(-2)
      }).join('')
    }
    const exampleKeypair = Keypair.generate()
    const konstruktor = new Crypto()

    const localPrivateKey = toHexString(exampleKeypair.publicKey.toBytes())
    Crypto.getPublicKey(localPrivateKey)
  })
  test('computeSharedSecret before init', () => {
    const exampleKeypair = Keypair.generate()
    const konstruktor = new Crypto()

    const localPublicKey = exampleKeypair.publicKey
    const result = konstruktor.computeSharedSecret(localPublicKey)
    expect(result).toBeNull()
  })
  test('computeSharedSecret after init', () => {
    const exampleKeypair = Keypair.generate()
    const secondExampleKeypair = Keypair.generate()
    const konstruktor = new Crypto()

    const localRecipientPublicKey = secondExampleKeypair.publicKey
    konstruktor.init(exampleKeypair)
    const result = konstruktor.computeSharedSecret(localRecipientPublicKey)
    expect(result).not.toBeNull()
  })
  test('signMessage before init', () => {
    const argument = 'string'
    const konstruktor = new Crypto()
    const result = konstruktor.signMessage(argument)
    expect(result).toBe(null) // We did not initialize it
  })
  test('signMessage after init', () => {
    const argument = 'string'
    const exampleKeypair = Keypair.generate()
    const konstruktor = new Crypto()
    konstruktor.init(exampleKeypair)
    const result = konstruktor.signMessage(argument)

    expect(result).not.toBe(null) // We initialized it
    // The result is of type array, and it is random.
    // Hence we only test that it is not null.
  })
  test('getRandomString returns error for undefined window.crypto method', () => {
    // TypeError would result for this call to the static function
    // because window.crypto.getRandomValue has not been mocked

    const argument = 16
    try {
      const result = Crypto.getRandomString(argument)
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
      expect(error).toHaveProperty(
        'message',
        `Cannot read properties of undefined (reading 'getRandomValues')`,
      )
    }
  })
})
