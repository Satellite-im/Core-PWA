import detectEthereumProvider from '@metamask/detect-provider'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

export default class MetamaskAdapter {
  name: string
  url: string
  icon: string
  private _connecting
  private _wallet: any
  private _publicKey: any
  private _readyState: WalletReadyState | null
  private provider: any

  constructor() {
    this.name = 'Metmask'
    this.url = 'https://metamask.io'
    this.icon = 'metamask.svg'
    this._connecting = false
    this._wallet = null
    this._publicKey = null
    this._readyState = WalletReadyState.Unsupported
  }

  async connect(): Promise<void> {
    const accounts = await this.provider.request({
      method: 'eth_requestAccounts',
    })

    if (this.provider.isConnected()) {
      this._publicKey = accounts[0]
      this._connecting = true
    }
  }

  readyState(): WalletReadyState {
    if (this.provider) {
      window.console.log('ready states')
      return WalletReadyState.Installed
    }
    window.console.log(this.provider)
    return WalletReadyState.NotDetected
  }

  async setProvider() {
    if (!this.provider) {
      this.provider = await detectEthereumProvider()
    }
  }

  get publicKey(): PublicKey {
    const out = new PublicKey(Buffer.from(this._publicKey))
    return out
  }

  get connected(): boolean {
    return this.provider.isConnected()
  }

  signMessage(message: Uint8Array): Promise<Uint8Array> {
    const TxtMessage = Buffer.from(message).toString('hex')
    return this.provider.request('personal_sign', [TxtMessage, this.publicKey])
  }
}
