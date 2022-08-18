import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  CoinbaseWalletAdapter,
  BitKeepWalletAdapter,
  Coin98WalletAdapter,
  ExodusWalletAdapter,
  GlowWalletAdapter,
  TokenPocketWalletAdapter,
  SpotWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletReadyState } from '@solana/wallet-adapter-base'

export interface walletList {
  name: string
  icon: string
  url: string
  state: string
}

export const getUsableWallets = (): Array<walletList> => {
  const result: Array<walletList> = []

  result.push({
    name: 'Phantom',
    icon: 'phantom.svg',
    url: new PhantomWalletAdapter().url,
    state: new PhantomWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'Solflare',
    icon: 'solflare.svg',
    url: new SolflareWalletAdapter().url,
    state: new SolflareWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'Slope',
    icon: 'slope.svg',
    url: new SlopeWalletAdapter().url,
    state: new SlopeWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'Coinbase',
    icon: 'coinbase.svg',
    url: new CoinbaseWalletAdapter().url,
    state: new CoinbaseWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'BitKeep',
    icon: 'bitkeep.svg',
    url: new BitKeepWalletAdapter().url,
    state: new BitKeepWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'Coin98',
    icon: 'coin98.svg',
    url: new Coin98WalletAdapter().url,
    state: new Coin98WalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'Exodus',
    icon: 'exodus.svg',
    url: new ExodusWalletAdapter().url,
    state: new ExodusWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'Glow',
    icon: 'glow.svg',
    url: new GlowWalletAdapter().url,
    state: new GlowWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'TokenPocket',
    icon: 'tokenpocket.svg',
    url: new TokenPocketWalletAdapter().url,
    state: new TokenPocketWalletAdapter().readyState.toString(),
  })

  result.push({
    name: 'Spot',
    icon: 'spot.svg',
    url: new SpotWalletAdapter().url,
    state: new SpotWalletAdapter().readyState.toString(),
  })

  return result
}
