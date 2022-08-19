import { RpcResponseAndContext, SignatureResult } from '@solana/web3.js'

import { Account, Adapter } from '../../interfaces'

import MultiWalletManager from '~/libraries/WalletManager/WalletManager'

export default class MultiWalletAdapter implements Adapter {
  private readonly $WalletManager: MultiWalletManager
  constructor() {
    this.$WalletManager = new MultiWalletManager()
  }

  initUserProgram(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  _getConnectionStatus(): boolean {
    return this.$WalletManager.WalletAdapter.connected
  }

  async signMessage(_message: string): Promise<Uint8Array> {
    return this.$WalletManager.signMessage(_message)
  }

  createRandomAccount(): Promise<Account | undefined> {
    throw new Error('Method not implemented.')
  }

  // here we don't need the mnemonic, since this function only triggers the wallet connection
  async getAccountFromMnemonic(_mnemonic: string): Promise<Account | null> {
    try {
      await this.$WalletManager.setWallet(_mnemonic)
      await this.$WalletManager.initWallet()

      const account: Account = {
        address: this.$WalletManager.getwalletPublicKey().toBase58(),
        publicKey: this.$WalletManager.getwalletPublicKey(),
      }
      window.console.log('account', account)
      return account
    } catch (error) {
      window.console.log('error', error)
      return null
    }
  }

  async getAccountBalance(_account: Account): Promise<number | null> {
    return await this.$WalletManager.getCurrentAccountBalance()
  }

  requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null> {
    throw new Error('This method dose not exist in Phantom')
  }

  async getActiveAccount(): Promise<Account | undefined> {
    if (this._getConnectionStatus()) {
      return {
        address: this.$WalletManager.getwalletPublicKey().toBase58(),
        publicKey: this.$WalletManager.getwalletPublicKey(),
      }
    }
    return undefined
  }

  async getPayerAccount(): Promise<Account | undefined> {
    return await this.getActiveAccount()
  }
}
