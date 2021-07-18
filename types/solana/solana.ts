import { Keypair } from '@solana/web3.js'

export interface SolanaWallet {
  mnemonic?: string
  keypair: Keypair
  path?: string
  address: string
}
