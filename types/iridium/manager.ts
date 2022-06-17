import { Account } from '~/libraries/BlockchainClient/interfaces'

export interface Credentials {
  id: string
  pass: string
}

export interface IridiumWalletConfig extends Credentials {
  wallet: Account
}
