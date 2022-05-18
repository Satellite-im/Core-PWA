import { Keypair, PublicKey } from '@solana/web3.js'
import { encode as base58encode, decode as base58decode } from 'micro-base58'
import { SolanaWallet } from '~/types/solana/solana'
import {
  Account,
  FriendStatus,
  Status,
} from '~/libraries/BlockchainClient/interfaces'

export const accountFromWallet = (wallet: SolanaWallet): Account => {
  return {
    privateKey: base58encode(wallet.keypair.secretKey),
    address: wallet.address,
    mnemonic: wallet.mnemonic,
    path: wallet.path,
  }
}

export const publicKeyFromAddress = (address: string): PublicKey => {
  return new PublicKey(base58decode(address))
}

export const walletFromAccount = (account: Account): SolanaWallet => {
  const keyPair = Keypair.fromSecretKey(base58decode(account.privateKey), {
    skipValidation: true,
  })
  return {
    keypair: keyPair,
    address: account.address,
    mnemonic: account.mnemonic,
    path: account.path,
  }
}
