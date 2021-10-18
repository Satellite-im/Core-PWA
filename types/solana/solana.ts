// eslint-disable-next-line import/named
import { AccountInfo, Keypair, PublicKey } from '@solana/web3.js'

export interface SolanaWallet {
  mnemonic?: string
  keypair: Keypair
  path?: string
  address: string
}

export interface ProgramAccountInfo {
  pubkey: PublicKey
  account: AccountInfo<Buffer>
}
