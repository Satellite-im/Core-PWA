// eslint-disable-next-line import/named
import { Commitment } from '@solana/web3.js'

export const Config = {
  debug: true,
  textile: {
    localURI: 'http://localhost:6007',
    key: process.env.NUXT_ENV_TEXTILE_API_KEY,
    browser: 'https://hub.textile.io',
  },
  ipfs: {
    gateway: 'https://satellite.mypinata.cloud/ipfs/',
  },
  // Keep in sync with Sounds enum in SoundManager.ts
  sounds: {
    doesLoop: ['call'],
    newMessage:
      'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Notification.m4a',
    call: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Call.m4a',
    hangup: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Unused.m4a',
    mute: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Mute.m4a',
    unmute: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Unmute.m4a',
    deafen: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Deafen.m4a',
    undeafen: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Undeafen.m4a',
    upload: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Success.m4a',
    connected: 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9/Success.m4a',
  },
  cacher: {
    user_lifespan: 90000,
  },
  webtorrent: {
    announceURLs: [
      'wss://tracker.openwebtorrent.com',
      'wss://tracker.sloppyta.co:443/announce',
      'wss://tracker.novage.com.ua:443/announce',
      'udp://opentracker.i2p.rocks:6969/announce',
      'http://opentracker.i2p.rocks:6969/announce',
      'udp://tracker.opentrackr.org:1337/announce',
      'http://tracker.opentrackr.org:1337/announce',
    ],
  },
  solana: {
    customFaucet: 'https://faucet.satellite.one',
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
    },
  ],
  badges: {
    verified: {
      color: '#55efc4',
      icon: 'check',
    },
    community: {
      color: '#a29bfe',
      icon: 'users',
    },
    cameraman: {
      color: '#d63031',
      icon: 'video',
    },
  },
  chat: {
    defaultMessageLimit: 50,
    defalutLoadMoreLimit: 20,
    timestampUpdateInterval: 60 * 1000,
  },
  routingMiddleware: {
    prerequisitesCheckBypass: ['auth', 'setup'],
  },
  uploadByteLimit: 1048576 * 8, // 8mb
  regex: {
    // regex to identify if a filetype is an image we support
    image: '^.*.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$',
    // Regex to check if string is only blank space
    blankSpace: '^[\\s|&nbsp;]+$',
  },
}
