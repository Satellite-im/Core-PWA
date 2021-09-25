// eslint-disable-next-line import/named
import { Commitment } from '@solana/web3.js'

export const Config = {
  debug: false,
  textile: {
    localURI: 'http://localhost:6007',
    key: process.env.TEXTILE_API_KEY,
    browser: 'https://hub.textile.io',
  },
  ipfs: {
    gateway: 'https://ipfs.io/ipfs/',
  },
  // Keep in sync with Sounds enum in SoundManager.ts
  sounds: {
    doesLoop: ['call'],
    newMessage: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Notification.ogg',
    call: 'QmSSLAFWdneYGBfX2JK7bJNhgpcLbeCABZXLHp1rEsAdaF',
    hangup: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Unused.ogg',
    mute: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Mute.ogg',
    unmute: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Unmute.ogg',
    deafen: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Deafen.ogg',
    undeafen: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Undeafen.ogg',
    upload: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Success.ogg',
    connected: 'QmSkZGMEJGDgsq1X3p72Rp9QScjHa2AoWRkMcSve4CmQS4/Success.ogg',
  },
  cacher: {
    user_lifespan: 90000,
  },
  webtorrent: {
    announceURLs: [
      'wss://tracker.openwebtorrent.com',
      'wss://tracker.sloppyta.co:443/announce',
      'wss://tracker.novage.com.ua:443/announce',
    ],
  },
  solana: {
    network: 'devnet',
    serverProgramId: 'FGdpP9RSN3ZE8d1PXxiBXS8ThCsXdi342KmDwqSQ3ZBz',
    friendsProgramId: 'BxX6o2HG5DWrJt2v8GMSWNG2V2NtxNbAUF3wdE5Ao5gS',
    defaultCommitment: 'confirmed' as Commitment,
    defaultPreflightCommitment: 'confirmed' as Commitment,
  },
  // Realms are just different chains we support
  realms: [
    {
      id: 'solana',
      nickname: 'Helios',
      disabled: false,
    },
    {
      id: 'matic',
      nickname: 'Dodecahedron',
      disabled: true,
    },
    {
      id: 'ethereum',
      nickname: 'Ethereal',
      disabled: true,
    },
    {
      id: 'algorand',
      nickname: 'Penumbra',
      disabled: true,
    }
  ],
  badges: {
    verified: {
      color: '#55efc4',
      icon: ['far', 'check'],
    },
    community: {
      color: '#a29bfe',
      icon: ['far', 'users'],
    },
    cameraman: {
      color: '#d63031',
      icon: ['far', 'video'],
    },
  },
}
