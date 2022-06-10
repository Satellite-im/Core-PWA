import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Connection, PublicKey } from '@solana/web3.js'
import { Config } from '~/config'
import { getClusterFromNetworkConfig } from '~/libraries/Solana/Solana'

export default class PhantomManager {
  clusterApiUrl: string
  connection: Connection
  walletPublicKey: PublicKey | null
  provider = this.getProvider()
  $PhantomWalletAdapter: PhantomWalletAdapter = new PhantomWalletAdapter()

  constructor() {
    this.clusterApiUrl = getClusterFromNetworkConfig(Config.solana.network)
    this.connection = new Connection(this.clusterApiUrl, {
      commitment: Config.solana.defaultCommitment,
      httpHeaders: Config.solana.httpHeaders,
    })
    this.walletPublicKey = null
  }

  /**
   * @method initWallet
   * @description Initializes the wallet
   **/
  async initWallet() {
    if (this.provider.isPhantom) {
      await this.$PhantomWalletAdapter.connect()
      this.$PhantomWalletAdapter.on('error', (error) => {
        throw new Error('Phantom wallet error: ' + error)
      })
      this.walletPublicKey = this.$PhantomWalletAdapter.publicKey
    }
  }

  /**
   * @method getProvider
   * @returns a provider for the wallet
   */
  getProvider() {
    if ('solana' in window) {
      // @ts-ignore
      const provider = window.solana
      if (provider.isPhantom) {
        return provider
      }
    }
    window.open('https://phantom.app/', '_blank')
  }

  /**
   * @method walletPublicKey
   * @returns the account public key
   */
  getwalletPublicKey(): PublicKey {
    if (!this.walletPublicKey) {
      throw new Error('Wallet not initialized')
    }
    return this.walletPublicKey
  }

  /**
   * @method getCurrentAccountBalance
   * @returns the current account balance
   */
  async getCurrentAccountBalance(): Promise<number | null> {
    if (this.$PhantomWalletAdapter.connected) {
      return this.connection.getBalance(
        this.getwalletPublicKey(),
        Config.solana.defaultCommitment,
      )
    }
    return null
  }

  /**
   * @method getAccountBalance
   * @returns the balance of the given account
   */
  getAccountBalance(account: PublicKey) {
    return this.connection.getBalance(account, Config.solana.defaultCommitment)
  }

  getAdapter(): PhantomWalletAdapter {
    if (this.$PhantomWalletAdapter.connected) {
      return this.$PhantomWalletAdapter
    }
    throw new Error('Phantom wallet not connected')
  }
}
