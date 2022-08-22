import { Account, Adapter } from '../../interfaces'
import PhantomManager from '~/libraries/Phantom/PhantomManager'

export default class PhantomAdapter implements Adapter {
  private readonly $PhantomManager: PhantomManager = new PhantomManager()

  constructor() {
    this.$PhantomManager = new PhantomManager()
  }

  initUserProgram(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  _getConnectionStatus(): boolean {
    return this.$PhantomManager.$PhantomWalletAdapter.connected
  }

  async signMessage(_message: string): Promise<Uint8Array> {
    return this.$PhantomManager.signMessage(_message)
  }

  createRandomAccount(): Promise<Account | undefined> {
    throw new Error('Method not implemented.')
  }

  // here we don't need the mnemonic, since this function only triggers the wallet connection
  async getAccountFromMnemonic(_mnemonic?: string): Promise<Account | null> {
    try {
      await this.$PhantomManager.initWallet()
      const account: Account = {
        address: this.$PhantomManager.getwalletPublicKey().toBase58(),
        publicKey: this.$PhantomManager.getwalletPublicKey(),
      }
      return account
    } catch (e) {
      return null
    }
  }

  async getAccountBalance(_account: Account): Promise<number | null> {
    return await this.$PhantomManager.getCurrentAccountBalance()
  }

  async getActiveAccount(): Promise<Account | undefined> {
    if (this._getConnectionStatus()) {
      return {
        address: this.$PhantomManager.getwalletPublicKey().toBase58(),
        publicKey: this.$PhantomManager.getwalletPublicKey(),
      }
    }
    return undefined
  }

  async getPayerAccount(): Promise<Account | undefined> {
    return await this.getActiveAccount()
  }
}
