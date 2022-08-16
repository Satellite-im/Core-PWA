import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

import { WalletReadyState } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

export default class WalletConnectAdapter {
  connector: WalletConnect
  private accounts: any
  url: string
  private name: string
  private _publicKey: PublicKey | null
  private _readyState: WalletReadyState | null

  constructor() {
    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
    })
    this.url = 'https://walletconnect.org'
    this.name = 'WalletConnect'
    this._readyState = WalletReadyState.Installed
    this._publicKey = null
  }

  getConnector(): WalletConnect {
    if (!this.connector) {
      throw new Error('Connector not initialized')
    }
    return this.connector
  }

  get connected(): boolean {
    return this.getConnector().connected
  }

  get publicKey(): PublicKey {
    if (!this._publicKey) {
      throw new Error('Public key not initialized')
    }
    return this._publicKey
  }

  get readyState(): WalletReadyState {
    if (!this._readyState) {
      throw new Error('Ready state not initialized')
    }
    return this._readyState
  }

  async connect() {
    if (!this.connected) {
      this.getConnector().createSession()
    }

    // Subscribe to connection events
    this.getConnector().on('connect', (error, payload) => {
      if (error) {
        throw error
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0]
      this.accounts = accounts[0]
      console.log(this.accounts)
      this._publicKey = new PublicKey(Buffer.from(this.accounts, 'hex'))
    })

    this.getConnector().on('session_update', (error, payload) => {
      if (error) {
        throw error
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
      this.accounts = accounts[0]
    })

    this.getConnector().on('disconnect', (error, payload) => {
      if (error) {
        throw error
      }

      // Delete connector
    })
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this.connected) {
      throw new Error('Connectio  has not been established')
    }
    const TxtMessage = Buffer.from(message).toString('hex')
    const msgParams = [
      Buffer.from(TxtMessage, 'utf8').toString('hex'), // Required
      this.accounts, // Required
    ]

    const result = await this.getConnector()
      .signPersonalMessage(msgParams)
      .catch((error) => {
        // Error returned when rejected
        console.error(error)
      })
    return Buffer.from(result.raw, 'hex')
  }
}
