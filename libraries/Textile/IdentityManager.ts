// import { Context } from '@textile/context'
import { Client, PrivateKey, Identity, Users } from '@textile/hub'

// @ts-ignore
import { AuthData } from '../Interfaces'
import { Config } from '~/config'
import { SolanaWallet } from '~/types/solana/solana'
import Crypto from '~/libraries/Crypto/Crypto'

export default class IdentityManager {
  private _client?: Client
  private _users?: Users
  private _identity?: Identity

  // Getters
  get client() {
    return this._client
  }

  get users() {
    return this._users
  }

  get identity() {
    return this._identity
  }

  /**
   * @method
   * Generates a string to be signed
   * @param address String rapresentation of the public key
   * @param secret secret string
   * @returns a message to be signed
   */
  private generateMessageForEntropy(address: string, secret: string): string {
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
  async initFromWallet(wallet: SolanaWallet) {
    const cryptoInstance = new Crypto()

    const secret = await cryptoInstance.hash('Satellite.im')
    const message = this.generateMessageForEntropy(wallet.address, secret)
    const signedText = await cryptoInstance.signMessageWithKey(
      wallet.keypair.secretKey,
      message
    )
    const hash = await cryptoInstance.hash(signedText)

    if (hash === null) {
      throw new Error(
        'No account is provided. Please provide an account to this application.'
      )
    }
    // The following line converts the hash in hex to an array of 32 integers.
    // // @ts-ignore
    // const array = hash
    //   .replace('0x', '')
    //   .match(/.{2}/g)
    //   .map((hexNoPrefix) => parseInt('0x' + hexNoPrefix))

    const array = Buffer.from(hash, 'hex')

    if (array.length !== 32) {
      throw new Error(
        'Hash of signature is not the correct size! Something went wrong!'
      )
    }

    this._identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array))

    // Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
    return this._identity
  }

  /**
   * @method
   * Generates a new random identity
   * @returns the identity
   */
  async createRandom(): Promise<Identity> {
    /** No cached identity existed, so create a new one */
    this._identity = await PrivateKey.fromRandom()

    return this._identity
  }

  /**
   * @method
   * Initializes an identity from a given privateKey
   * @param privateKey string representation of a private key
   * @returns the identity
   */
  initFromPrivateKey(privateKey: string) {
    this._identity = PrivateKey.fromString(privateKey)
    return this._identity
  }

  async authorize(identity: Identity): Promise<AuthData> {
    if (!Config.textile.key) {
      throw new Error('Textile key not found')
    }

    const client = await Client.withKeyInfo({ key: Config.textile.key })
    // const context = new Context(Config.textile.localURI)
    // const client =
    //   Config.env === 'dev'
    //     ? new Client(context)
    //     : await Client.withKeyInfo({
    //         key: config.textile.key,
    //       })

    const users = await Users.withKeyInfo({
      key: Config.textile.key,
    })

    try {
      await users.getToken(identity)

      const token = await client.getToken(identity)

      return {
        client,
        token,
        users,
      }
    } catch (_) {
      throw new Error("Couldn't connect to Textile.io")
    }
  }

  isInitialized() {
    return Boolean(this._identity)
  }
}
