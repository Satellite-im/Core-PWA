import { Client, Identity, Users } from '@textile/hub'
import { Account } from '~/libraries/BlockchainClient/interfaces'

export interface StorageConfig {
  id: string
  pass: string
}

export interface TextileConfig extends StorageConfig {
  wallet?: Account
}

export interface Creds {
  id: string
  pass: string
}

export interface TextileInitializationData {
  identity: Identity
  client: Client
  users: Users
  wallet: Account
}

export type TextileImage = {
  url: string
  name: string
  size: number
  type: string
}

export interface BucketConfig extends TextileConfig {
  name: string
}
