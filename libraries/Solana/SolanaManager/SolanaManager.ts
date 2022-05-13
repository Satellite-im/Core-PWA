import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js'
import * as bip39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'
import {
  getClusterFromNetworkConfig,
  publicKeyFromSeed,
  sleep,
} from '../Solana'
import { Config } from '~/config'
import { SolanaWallet } from '~/types/solana/solana'

export default class SolanaManager {
  accounts: Array<SolanaWallet>
  payerAccount?: Keypair
  connection: Connection
  mnemonic?: string
  userAccount?: Keypair | null
  networkIdentifier: string
  clusterApiUrl: string
  publicKeys: { [key: string]: PublicKey }

  constructor() {
    this.accounts = []
    this.networkIdentifier = Config.solana.network
    this.clusterApiUrl = getClusterFromNetworkConfig(Config.solana.network)
    this.connection = new Connection(this.clusterApiUrl, {
      commitment: Config.solana.defaultCommitment,
      httpHeaders: Config.solana.httpHeaders,
    })
    this.publicKeys = {}
  }

  /**
   * @method getPath
   * @param index index of the account to genenerate
   * @returns the ethereum like path for generating a new deterministic account
   */
  getPath(index: number): string {
    return `m/44'/501'/${index}'/0'`
  }

  /**
   * @method deriveSeed
   * @param seed seed of mnemonic
   * @param index index of the account to genenerate
   * @returns the ethereum like path for generating a new deterministic account
   */
  deriveSeed(seed: Buffer, path: string): Buffer {
    // const path = this.getPath(walletIndex)
    return ed25519.derivePath(path, seed.toString('hex')).key
  }

  /**
   * @method createRandomKeypair
   * @description Generates a Solana keypair from a random generated
   * bip39 mnemonic phrase
   * @returns a SolanaWallet
   */
  async createRandomKeypair(): Promise<SolanaWallet> {
    const mnemonic = bip39.generateMnemonic()
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const path = this.getPath(0)
    const seedWithPath = this.deriveSeed(seed, path)
    const keypair = Keypair.fromSeed(seedWithPath)
    const address = keypair.publicKey.toBase58()

    return { keypair, mnemonic, path, address }
  }

  /**
   * @method restoreKeypairFromMnemonic
   * @description Restores a Solana keypair from a given mnemonic phrase
   * @returns a SolanaWallet
   */
  async restoreKeypairFromMnemonic(
    mnemonic: string,
    accountIndex: number,
  ): Promise<SolanaWallet | null> {
    if (!bip39.validateMnemonic(mnemonic)) {
      return null
    }

    const seed = await bip39.mnemonicToSeed(mnemonic)
    const path = this.getPath(accountIndex)
    const seedWithPath = this.deriveSeed(seed, path)
    const keypair = Keypair.fromSeed(seedWithPath)
    const address = keypair.publicKey.toBase58()

    return { keypair, mnemonic, path, address }
  }

  /**
   * @method generateUserKeypair
   * @description Restores the Solana keypair that is used
   * for storing user information from a given mnemonic phrase
   * @returns a SolanaWallet
   */
  async generateUserKeypair(): Promise<Keypair | null> {
    if (!this.mnemonic) {
      return null
    }

    const path = 'user'

    const seed = await bip39.mnemonicToSeed(this.mnemonic)
    const seedWithPath = `${seed.toString('utf-8')}${path}`

    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      Buffer.from(seedWithPath),
    )
    const keypair = Keypair.fromSeed(new Uint8Array(hashBuffer))

    return keypair
  }

  /**
   * @method generateDerivedPublicKey
   * @description Derives a public key from the combination of a public key, a seed string
   * and a program id. Useful to predict the derived friendsInfo Account public key
   * @param identifier identifier string for storing the generated public key
   * @param userPublicKey user pablic key to use as base for derivation
   * @param seed seed string to use for derivation
   * @param programId program id to use for derivation
   * @returns a derived public key
   */
  async generateDerivedPublicKey(
    identifier: string,
    userPublicKey: PublicKey,
    seed: string,
    programId: PublicKey,
  ): Promise<PublicKey | null> {
    const { key } = await publicKeyFromSeed(userPublicKey, seed, programId)

    this.publicKeys[identifier] = key
    return key
  }

  /**
   * @method getDerivedPublicKey
   * @description Returns the public key that is associated to the given
   * identifier
   * @param identifier identifier of the public key to retrieve
   * @returns a solana public key
   */
  getDerivedPublicKey(identifier: string): PublicKey | undefined {
    return this.publicKeys[identifier]
  }

  /**
   * @method generateNewAccount
   * @description Devrives a new account from the next path
   */
  async generateNewAccount(): Promise<SolanaWallet | null> {
    if (!this.mnemonic) {
      return null
    }

    const account = await this.restoreKeypairFromMnemonic(
      this.mnemonic,
      this.accounts.length,
    )

    if (!account) {
      return null
    }

    const { keypair, address, mnemonic, path } = account
    this.accounts.push({ keypair, address, mnemonic, path })

    return account
  }

  /**
   * @method initializeRandom
   * @description Initialize a Solana account by restoring the secret key
   * or generates a new account if the key is not passed
   */
  async initializeRandom() {
    const { keypair, mnemonic, address, path } =
      await this.createRandomKeypair()
    this.payerAccount = keypair
    this.accounts.push({ keypair, address, mnemonic, path })
    this.mnemonic = mnemonic

    this.userAccount = await this.generateUserKeypair()
  }

  /**
   * @method initializeFromKeypair
   * @description Initialize a Solana account from a given Keypair
   */
  async initializeFromKeypair(keypair: Keypair) {
    const address = keypair.publicKey.toBase58()
    this.accounts.push({ keypair, address })
    this.payerAccount = keypair

    this.userAccount = await this.generateUserKeypair()
  }

  /**
   * @method initializeFromMnemonic
   * @description Initialize a Solana account from a mnemonic seed phrase
   */
  async initializeFromMnemonic(mnemonic: string) {
    const solanaWallet = await this.restoreKeypairFromMnemonic(mnemonic, 0)

    if (solanaWallet) {
      const { keypair, address, path } = solanaWallet
      this.accounts.push({ keypair, address, path, mnemonic })
      this.payerAccount = keypair
      this.mnemonic = mnemonic

      this.userAccount = await this.generateUserKeypair()
    }
  }

  /**
   * @method initializeFromSolanaWallet
   * @description Initialize a Solana account from a previously
   * generated solana wallet object
   */
  async initializeFromSolanaWallet(solanaWallet: SolanaWallet) {
    this.accounts.push(solanaWallet)
    this.payerAccount = solanaWallet.keypair
    this.mnemonic = solanaWallet.mnemonic
    this.userAccount = await this.generateUserKeypair()
  }

  /**
   * @method isInitialized
   * @description Utility function to check if the account has been initialized
   */
  isInitialized(): boolean {
    return Boolean(this.connection && this.payerAccount)
  }

  /**
   * @method getAccounts
   * @returns the list of available accounts
   */
  getAllAccounts() {
    return this.accounts
  }

  /**
   * @method getAccount
   * @param address the account public key
   * @returns
   */
  getAccount(address: string): SolanaWallet | undefined {
    return this.accounts.find((account) => account.address === address)
  }

  /**
   * @method getMainSolanaWalletInstance
   * @returns the main solana wallet instance
   */
  getMainSolanaWalletInstance() {
    return this.accounts?.[0]
  }

  /**
   * @method getActiveAccount
   * @returns the payer account keypair
   */
  getActiveAccount() {
    return this.payerAccount
  }

  /**
   * @method getUserAccount
   * @returns the user account keypair
   */
  getUserAccount() {
    return this.userAccount
  }

  /**
   * @method getCurrentAccountBalance
   * @returns The balance of the payer account
   */
  getCurrentAccountBalance() {
    if (this.payerAccount) {
      return this.connection.getBalance(
        this.payerAccount.publicKey,
        Config.solana.defaultCommitment,
      )
    }

    return null
  }

  /**
   * @method requestAirdrop
   * @description Request an airdropfrom solana devnet
   * 1 lamport = 0.000000001 SOL
   * @returns
   */
  async requestAirdrop() {
    if (!this.payerAccount) return null

    let signature

    if (
      Config.solana.network !== 'local' &&
      Config.solana.customFaucet !== ''
    ) {
      const result = await fetch(Config.solana.customFaucet, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: this.payerAccount?.publicKey.toBase58(),
        }),
      })

      const jsonResult = await result.json()
      if (jsonResult.status === 'success') {
        signature = jsonResult.transactionSignature
      } else {
        return null
      }
    } else {
      signature = await this.connection.requestAirdrop(
        this.payerAccount?.publicKey,
        1000000000,
      )
    }

    return this.connection.confirmTransaction(
      signature,
      Config.solana.defaultCommitment,
    )
  }
}
