import { Account } from '../BlockchainClient/interfaces'
import Crypto from '~/libraries/Crypto/Crypto'
import logger from '~/plugins/local/logger'
// @ts-ignore

export default class IdentityManager {
  /**
   * @method
   * Generates a string to be signed
   * @param address String rapresentation of the public key
   * @param secret secret string
   * @returns a message to be signed
   */
  static generateEntropyMessage(address: string, secret: string): string {
    return (
      '******************************************************************************** \n' +
      'READ THIS MESSAGE CAREFULLY. \n' +
      'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
      'ACCESS TO THIS APPLICATION. \n' +
      'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
      'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
      '******************************************************************************** \n' +
      'The Solana address used by this application is: \n' +
      '\n' +
      address +
      '\n' +
      '\n' +
      '\n' +
      'By signing this message, you authorize the current application to use the \n' +
      'following app associated with the above address: \n' +
      '\n' +
      'Satellite' +
      '\n' +
      '\n' +
      '\n' +
      'The hash of your non-recoverable, private, non-persisted password or secret \n' +
      'phrase is: \n' +
      '\n' +
      secret +
      '\n' +
      '\n' +
      '\n' +
      '******************************************************************************** \n' +
      'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
      'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
      'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
      'WRITE ACCESS TO THIS APPLICATION. \n' +
      '******************************************************************************** \n'
    )
  }

  /**
   * @method
   * Initializes the Identity manager starting from the user public key of a
   * Solana Wallet instance
   * @param wallet a Solana Wallet instance
   * @returns the identity
   */
  static async seedFromWallet(
    passphrase: string,
    wallet: Account,
  ): Promise<Uint8Array> {
    return IdentityManager.seedFromPrivateKey(
      passphrase,
      Buffer.from(wallet.privateKey),
    )
  }

  /**
   * @method
   * Generates a new random identity
   * @returns the identity
   */
  static async seedRandom(): Promise<Uint8Array> {
    return Crypto.getRandomSeed()
  }

  static async seedFromPrivateKey(
    passphrase: string,
    privateKey: Uint8Array,
  ): Promise<Uint8Array> {
    logger.log('iridium/manager', 'seedFromPrivateKey()', {
      passphrase,
      privateKey,
    })
    const publicKey = await Crypto.getPublicKey(privateKey.slice(4, 36))
    const secret = await Crypto.hash(passphrase)
    const message = IdentityManager.generateEntropyMessage(
      Buffer.from(publicKey).toString('hex'),
      secret,
    )
    const signedText = await Crypto.signMessageWithKey(
      privateKey.slice(4, 36),
      message,
    )
    const seed = await Crypto.sha256(signedText)

    if (seed === null) {
      throw new Error(
        'No account is provided. Please provide an account to this application.',
      )
    }

    if (seed.length !== 32) {
      throw new Error(
        'Hash of signature is not the correct size! Something went wrong!',
      )
    }

    return seed
  }
}
