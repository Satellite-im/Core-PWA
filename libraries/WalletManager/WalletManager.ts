import {
  BaseMessageSignerWalletAdapter,
  WalletReadyState,
} from '@solana/wallet-adapter-base'
import { Connection, PublicKey } from '@solana/web3.js'
import { Config } from '~/config'
import { getClusterFromNetworkConfig } from '~/libraries/Solana/Solana'
import MetamaskAdapter from '~/libraries/WalletManager/Custom/MetamaskAdapter'
import WalletConnectAdapter from '~/libraries/WalletManager/Custom/WalletConnectAdapter'

export default class MultiWalletManager {
  clusterApiUrl: string
  connection: Connection
  walletPublicKey: PublicKey | null
  provider: any
  $WalletAdapter:
    | BaseMessageSignerWalletAdapter
    | MetamaskAdapter
    | WalletConnectAdapter
    | undefined

  wallet: string
  link: string

  constructor() {
    this.clusterApiUrl = getClusterFromNetworkConfig(Config.solana.network)
    this.wallet = ''
    this.connection = new Connection(this.clusterApiUrl, {
      commitment: Config.solana.defaultCommitment,
      httpHeaders: Config.solana.httpHeaders,
    })
    this.walletPublicKey = null
    this.link = ''
  }

  /**
   * @method initWallet
   * @description Initializes the wallet
   **/
  async initWallet() {
    await this.WalletAdapter.connect()
    if (this.WalletAdapter.connected) {
      window.console.log('walletPublicKey', this.WalletAdapter.publicKey)
      this.walletPublicKey = this.WalletAdapter.publicKey
    } else {
      throw new Error('Wallet not connected')
    }
  }

  get WalletAdapter():
    | BaseMessageSignerWalletAdapter
    | MetamaskAdapter
    | WalletConnectAdapter {
    if (!this.$WalletAdapter) {
      throw new Error('Wallet not initialized')
    }
    return this.$WalletAdapter
  }

  setWalletAdapter(
    adapter:
      | BaseMessageSignerWalletAdapter
      | MetamaskAdapter
      | WalletConnectAdapter,
  ) {
    if (!adapter) {
      throw new Error('Wallet adapter not set')
    }
    this.$WalletAdapter = adapter
  }

  /**
   *
   * @param wallet
   * @description sets which wallet the manager will use
   * @returns void
   */
  async setWallet(wallet: string) {
    this.wallet = wallet
    this.setWalletAdapter(await this._adapterPicker(wallet))
    if (this.WalletAdapter instanceof MetamaskAdapter) {
      window.console.log('Metamask wallet provider selected')
      await this.WalletAdapter.setProvider()
    }
    if (this.WalletAdapter.readyState !== WalletReadyState.Installed) {
      window.open(this.WalletAdapter.url, '_blank')
      throw new Error('Wallet not installed')
    }
    if (!(this.WalletAdapter instanceof WalletConnectAdapter)) {
      await this.WalletAdapter.connect()
    }
  }

  /**
   * @method _adapterPicker
   * @returns the adapter based on the wallet name
   * @param wallet
   **/
  async _adapterPicker(wallet: String) {
    switch (wallet) {
      case 'Phantom': {
        window.console.log('Phantom wallet selected')
        // dynamic import of the wallet adapter
        const PhantomWalletAdapter = await import(
          '@solana/wallet-adapter-phantom'
        )
        return new PhantomWalletAdapter.PhantomWalletAdapter()
      }

      case 'Slope': {
        window.console.log('Slope wallet selected')
        const SlopeWalletAdapter = await import('@solana/wallet-adapter-slope')
        return new SlopeWalletAdapter.SlopeWalletAdapter()
      }

      case 'Solflare': {
        window.console.log('Solflare wallet selected')
        const SolflareWalletAdapter = await import(
          '@solana/wallet-adapter-solflare'
        )
        return new SolflareWalletAdapter.SolflareWalletAdapter()
      }

      case 'Coinbase': {
        window.console.log('Coinbase wallet selected')
        const CoinbaseWalletAdapter = await import(
          '@solana/wallet-adapter-coinbase'
        )
        return new CoinbaseWalletAdapter.CoinbaseWalletAdapter()
      }

      case 'Bitkeep': {
        window.console.log('Bitkeep wallet selected')
        const BitKeepWalletAdapter = await import(
          '@solana/wallet-adapter-bitkeep'
        )
        return new BitKeepWalletAdapter.BitKeepWalletAdapter()
      }

      case 'Coin98': {
        window.console.log('Coin98 wallet selected')
        const Coin98WalletAdapter = await import(
          '@solana/wallet-adapter-coin98'
        )
        return new Coin98WalletAdapter.Coin98WalletAdapter()
      }

      case 'Exodus': {
        window.console.log('Exodus wallet selected')
        const ExodusWalletAdapter = await import(
          '@solana/wallet-adapter-Exodus'
        )
        return new ExodusWalletAdapter.ExodusWalletAdapter()
      }

      case 'Glow': {
        window.console.log('Glow wallet selected')
        const GlowWalletAdapter = await import('@solana/wallet-adapter-Glow')
        return new GlowWalletAdapter.GlowWalletAdapter()
      }

      case 'BitKeep': {
        window.console.log('BitKeep wallet selected')
        const BitKeepWalletAdapter = await import(
          '@solana/wallet-adapter-BitKeep'
        )
        return new BitKeepWalletAdapter.BitKeepWalletAdapter()
      }
      case 'TokenPocket': {
        window.console.log('TokenPocket wallet selected')
        const TokenPocketWalletAdapter = await import(
          '@solana/wallet-adapter-TokenPocket'
        )
        return new TokenPocketWalletAdapter.TokenPocketWalletAdapter()
      }
      case 'Spot': {
        window.console.log('Spot wallet selected')
        const SpotWalletAdapter = await import('@solana/wallet-adapter-spot')
        return new SpotWalletAdapter.SpotWalletAdapter()
      }

      default:
        throw new Error('Wallet not found')
    }
  }

  /**
   * @method _getConnection
   * @returns return the connection
   */
  _getConnection(): Connection {
    if (!this.connection) {
      throw new Error('WalletManager is not initialized')
    }
    return this.connection
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
    if (this.WalletAdapter.connected) {
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

  getAdapter() {
    if (this.WalletAdapter.connected) {
      return this.WalletAdapter
    }
    throw new Error('Wallet not connected')
  }

  /**
   * @method signMessage
   * @returns the signature of the given message
   * @param message
   **/
  async signMessage(message: string): Promise<Uint8Array> {
    if (this.WalletAdapter.connected) {
      return this.WalletAdapter.signMessage(Buffer.from(message))
    }
    throw new Error('Wallet not connected')
  }
}
