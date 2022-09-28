import {
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
} from '@solana/web3.js'
import nacl from 'tweetnacl'
import nacl from 'tweetnacl'
import {
  Account,
  Adapter,
  CreateUserParams,
  FriendsEvents,
  User,
  Group,
} from '../../interfaces'
import {
  accountFromKeyapair,
  accountFromWallet,
  walletFromAccount,
} from './utils'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { AccountsError } from '~/store/accounts/types'

export default class SolanaAdapter implements Adapter {
  private readonly solanaManager: SolanaManager

  constructor() {
    this.solanaManager = new SolanaManager()
    this.usersProgram = null
  }

  async signMessage(message: string): Promise<Uint8Array> {
    const messageBytes = Buffer.from(message, 'utf8')
    const wallet = await this.getPayerAccount()
    if (!wallet?.secretKey) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    return nacl.sign.detached(messageBytes, wallet?.secretKey)
  }

  _getConnectionStatus(): boolean {
    if (this.solanaManager.isInitialized()) {
      return true
    }
    return false
  }

  get friendsProgram(): FriendsProgram {
    if (this._friendsProgram) return this._friendsProgram
    if (this.solanaManager.isInitialized()) {
      this._friendsProgram = new FriendsProgram(this.solanaManager)
      return this._friendsProgram
    }

    throw new Error(
      'Unable to get FriendsProgram instance: Solana not initialized yet',
    )
  }

  async createRandomAccount(): Promise<Account> {
    const wallet = await this.solanaManager.createRandomKeypair()
    return accountFromWallet(wallet)
  }

  async createUser(params: CreateUserParams): Promise<boolean> {
    if (params.account) {
      await this.initSolanaManager(params.account)
      await this.initUserProgram()
      await this.usersProgram?.create(
        params.name,
        params.photoHash,
        params.status,
      )
      return true
    }
    return false
  }

  async getAccountBalance(account: Account): Promise<number | null> {
    await this.initSolanaManager(account)
    return this.solanaManager.getCurrentAccountBalance()
  }

  async getAccountFromMnemonic(mnemonic?: string): Promise<Account | null> {
    if (!mnemonic) {
      throw new Error('Mnemonic is required when working with Solana directly')
    }
    await this.solanaManager.initializeFromMnemonic(mnemonic)
    const wallet = this.solanaManager.getMainSolanaWalletInstance()
    if (wallet) {
      return accountFromWallet(wallet)
    }
    return null
  }

  async requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null> {
    await this.solanaManager.requestAirdrop().then((out) => {
      return out
    })
    return null
  }

  private async initSolanaManager(account: Account) {
    await this.solanaManager.initializeFromSolanaWallet(
      walletFromAccount(account),
    )
  }

  private getAccounts(): {
    payerAccount: Keypair
    userAccount: Keypair
  } {
    const payerAccount = this.solanaManager.getActiveAccount()
    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const userAccount = this.solanaManager.getUserAccount()
    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }
    return {
      payerAccount,
      userAccount,
    }
  }

  async getUserInfo(address: string): Promise<User | null> {
    try {
      this.usersProgram = new UsersProgram(this.solanaManager)
      const e = await this.usersProgram.getUserInfo(address)
      return e
    } catch (e) {
      return null
    }
  }

  async getUsersInfo(addresses: string[]): Promise<User[]> {
    try {
      this.usersProgram = new UsersProgram(this.solanaManager)
      const users = await this.usersProgram.getUsersInfo(addresses)
      return users.map(
        (user) =>
          <User>{
            ...user,
          },
      )
    } catch (e) {
      throw new Error("Couldn't get users info")
    }
  }

  async getActiveAccount(): Promise<Account | undefined> {
    const account = this.solanaManager.getActiveAccount()
    return !account ? undefined : accountFromKeyapair(account)
  }

  async getPayerAccount(): Promise<Account | undefined> {
    const account = this.solanaManager.payerAccount
    return !account ? undefined : accountFromKeyapair(account)
  }
}
