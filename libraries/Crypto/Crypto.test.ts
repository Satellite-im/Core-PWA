import { expect } from '@jest/globals'
import { Keypair } from '@solana/web3.js'
import Crypto from './Crypto'

describe('', () => {
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
    function toHexString(byteArray) {
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
})
