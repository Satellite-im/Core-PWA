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
    // Regex to check if string contains only emoji's. Note: doesn't yet support emoji modifiers
    isEmoji: /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/,
    // Regex to wrap emoji's in spans. Note: Doesn't yet support emoji modifiers
    emojiWrapper: /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
  },
}
