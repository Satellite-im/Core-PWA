// import { Context } from '@textile/context'
import { Client, Identity, PrivateKey, Users } from '@textile/hub'
import { Config } from '~/config'
import Crypto from '~/libraries/Crypto/Crypto'
import { SolanaWallet } from '~/types/solana/solana'
// @ts-ignore
import { AuthData } from '../Interfaces'


export default class IdentityManager {
  client?: Client
  users?: Users
  identity?: Identity

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
  async initFromWallet(wallet: SolanaWallet): Promise<Identity> {
    const cryptoInstance = new Crypto()

    const secret = await cryptoInstance.hash('Satellite.im')
    const message = this.generateMessageForEntropy(wallet.address, secret)
    const signedText = await cryptoInstance.signMessageWithKey(
      wallet.keypair.secretKey,
      message,
    )
    const hash = await cryptoInstance.hash(signedText)

    if (hash === null) {
      throw new Error(
        'No account is provided. Please provide an account to this application.',
      )
    }

    const array = Buffer.from(hash, 'hex')

    if (array.length !== 32) {
      throw new Error(
        'Hash of signature is not the correct size! Something went wrong!',
      )
    }

    this.identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array))

    // Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
    return this.identity
  }

  /**
   * @method
   * Generates a new random identity
   * @returns the identity
   */
  async createRandom(): Promise<Identity> {
    /** No cached identity existed, so create a new one */
    this.identity = await PrivateKey.fromRandom()

    return this.identity
  }

  /**
   * @method
   * Initializes an identity from a given privateKey
   * @param privateKey string representation of a private key
   * @returns the identity
   */
  initFromPrivateKey(privateKey: string): Identity {
    this.identity = PrivateKey.fromString(privateKey)
    return this.identity
  }

  async authorize(identity: Identity): Promise<AuthData> {
    if (!Config.textile.key) {
      throw new Error('Textile key not found')
    }

    this.client = await Client.withKeyInfo({ key: Config.textile.key })

    this.users = await Users.withKeyInfo({
      key: Config.textile.key,
    })

    await this.users.getToken(identity)

    const token = await this.client.getToken(identity)

    return {
      client: this.client,
      token,
      users: this.users,
    }
  }

  isInitialized(): boolean {
    return Boolean(this.identity)
  }
}
