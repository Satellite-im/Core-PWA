import { RpcResponseAndContext, SignatureResult } from '@solana/web3.js'
import nacl from 'tweetnacl'
import { Account, Adapter } from '../../interfaces'
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
  }

  async signMessage(message: string): Promise<Uint8Array> {
    const messageBytes = Buffer.from(message, 'utf8')
    const wallet = await this.getPayerAccount()
    if (!wallet?.secretKey) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }
    // eslint-disable-next-line import/no-named-as-default-member
    return nacl.sign.detached(messageBytes, wallet?.secretKey)
  }

  _getConnectionStatus(): boolean {
    if (this.solanaManager.isInitialized()) {
      return true
    }
    return false
  }

  async createRandomAccount(): Promise<Account> {
    const wallet = await this.solanaManager.createRandomKeypair()
    return accountFromWallet(wallet)
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

  async getActiveAccount(): Promise<Account | undefined> {
    const account = this.solanaManager.getActiveAccount()
    return !account ? undefined : accountFromKeyapair(account)
  }

  async getPayerAccount(): Promise<Account | undefined> {
    const account = this.solanaManager.payerAccount
    return !account ? undefined : accountFromKeyapair(account)
  }
}
