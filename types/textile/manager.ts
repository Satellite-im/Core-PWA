import { Client, Identity, Users } from '@textile/hub'
import { SolanaWallet } from '../solana/solana'

export interface StorageConfig {
  id: string
  pass: string
}

export interface TextileConfig extends StorageConfig {
  wallet?: SolanaWallet
}

export interface Creds {
  id: string
  pass: string
}

export interface TextileInitializationData {
  identity: Identity
  client: Client
  users: Users
  wallet: SolanaWallet
}
