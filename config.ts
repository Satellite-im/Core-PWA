// eslint-disable-next-line import/named
import { Commitment } from '@solana/web3.js'
import type { IridiumConfig } from '@satellite-im/iridium'

const nodes = process.env.NUXT_ENV_IRIDIUM_SYNC_NODES?.split(',') || [
  '/ip4/localhost/tcp/443/wss/p2p/12D3KooWRgdhiJam4naWGYtgLXtc17ty89MMPvig41p9BhKG7FRW',
]
const gateways = process.env.NUXT_ENV_IRIDIUM_GATEWAYS?.split(',') || [
  'https://satellite.infura-ipfs.io',
]
export const Config = {
  debug: true,
  iridium: {
    nodes,
    gateways,
    ipfs: {
      config: {
        Bootstrap: nodes,
      },
    },
  } as Partial<IridiumConfig>,
  ipfs: {
    gateway: 'https://satellite.infura-ipfs.io/ipfs/',
  },
  indexedDbName: 'SatelliteDB',
  // Keep in sync with Sounds enum in SoundManager.ts
  sounds: {
    doesLoop: ['call'],
    newMessage: `sounds/Notification.m4a`,
    call: `sounds/Call.m4a`,
    hangup: `sounds/Unused.m4a`,
    mute: `sounds/Mute.m4a`,
    unmute: `sounds/Unmute.m4a`,
    deafen: `sounds/Deafen.m4a`,
    undeafen: `sounds/Undeafen.m4a`,
    upload: `sounds/Success.m4a`,
    connected: `sounds/Success.m4a`,
  },
  cacher: {
    user_lifespan: 90000,
  },
  webtorrent: {
    announceURLs: process.env.NUXT_ENV_DEVELOPMENT_TRACKER
      ? [process.env.NUXT_ENV_DEVELOPMENT_TRACKER] // DEVELOPMENT, yarn dev:tracker to start
      : [
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
    customFaucet: 'https://dev-faucet.satellite.one',
    network: process.env.NUXT_ENV_SOLANA_NETWORK || 'devnet',
    httpHeaders: process.env.NUXT_ENV_FIGMENT_APIKEY
      ? { Authorization: process.env.NUXT_ENV_FIGMENT_APIKEY }
      : undefined,
    serverProgramId: 'FGdpP9RSN3ZE8d1PXxiBXS8ThCsXdi342KmDwqSQ3ZBz',
    friendsProgramId: 'BxX6o2HG5DWrJt2v8GMSWNG2V2NtxNbAUF3wdE5Ao5gS',
    friendsProgramExId: 'GjS6t1gK9nktqDJBTjobm9Fdepxg2FGb4vifRDEQ8hXL',
    groupchatsProgramId: 'bJhvwTYCkQceANgeShZ4xaxUqEBPsV8e1NgRnLRymxs',
    defaultCommitment: 'confirmed' as Commitment,
    defaultPreflightCommitment: 'confirmed' as Commitment,
    usersProgramId: '8n2ct4HBadJdtr8T31JvYPTvmYeZyCuLUjkt3CwcSsh9',
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
    defaultLoadMoreLimit: 20,
    messageMaxChars: 2048,
    timestampUpdateInterval: 60 * 1000, // 60 seconds
    maxChars: 2048,
    typingInputThrottle: 5000,
    typingInputDebounce: 1000,
    maxUndoStack: 100,
    batchUndoSeconds: 5,
    searchCharLimit: 256,
    groupNameMinLength: 3,
    groupNameMaxLength: 64,
    uploadMaxLength: 8, // 8 files at a time
  },
  account: {
    minLength: 5,
    maxLength: 32,
    statusMaxLength: 128,
  },
  profile: {
    noteMaxChars: 256,
  },
  routingMiddleware: {
    prerequisitesCheckBypass: ['auth', 'setup'],
  },
  nsfwPictureLimit: 1048576 * 8, // 8MB - images will be scaled down to this value if possible to prevent memory issues - binary
  personalFilesLimit: 1000000000 * 4, // 4GB - free tier limit - decimal
  nsfwVideoLimit: 1073741824 * 2, // 2GB - videos larger than this crash - binary
  regex: {
    // identify if a file type is embeddable image
    image: '^.*.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$',
    // check for empty string or spaces/nbsp
    empty: /^\s*$/,
    // invalid characters in filesystem name
    invalid: /[/:"*?<>|~#%&+{}\\]+/,
    // Regex to wrap emoji's in spans. Note: Doesn't yet support emoji modifiers
    emojiWrapper: /[\p{Emoji_Presentation}\u200D]+/gu,
    // Check for link
    link: /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
    youtube: /^https?:\/\/([a-z0-9-]+[.])*youtube.com?/g,
    youtubeShort: /^https?:\/\/([a-z0-9-]+[.])*youtu.be?/g,
    vimeo: /^https?:\/\/([a-z0-9-]+[.])*vimeo.com?/g,
    facebook: /^https?:\/\/([a-z0-9-]+[.])*facebook.com?/g,
    twitch: /^https?:\/\/([a-z0-9-]+[.])twitch[.]tv\/?/g,
    spotify: /^https?:\/\/([a-z0-9-]+[.])spotify[.]com\/(playlist|embed)?/g,
    uuidv4:
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  },
  webrtc: {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'stun:stun2.l.google.com:19302',
      },
      {
        urls: 'stun:stun3.l.google.com:19302',
      },
      {
        urls: 'stun:stun4.l.google.com:19302',
      },
      {
        urls: 'stun:stun.services.mozilla.com',
      },
    ],
    constraints: {
      audio: true,
      video: {
        facingMode: 'user',
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
    },
    announceFrequency: 30000,
  },
  cropperOptions: {
    type: 'blob',
    circle: false,
    size: { width: 160, height: 160 },
    format: 'jpeg',
  },
  locale:
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language,
  // https://github.com/jhildenbiddle/canvas-size#test-results
  canvasLimits: {
    web: 11180, // to cater to firefox. chrome goes up to 16384
    ios: 4096,
    android: 10836, // lowest android value, some phones can handle more
    electron: 11180, // including for completeness sake
  },
  modal: {
    errorNetworkActionThrottle: 1000,
  },
  seedPhraseCharsCount: 12,
  pip: {
    /* Grid config, image splitting the screen in `rows x columns`
     _____ _____
    |_____|_____|
    |_____|_____|
    |_____|_____|
    |_____|_____|

    Depending on the center of the Pip, it will land on a specific slot
    */
    rows: [0, 1, 2, 3] as const,
    columns: [0, 1] as const,
    throttleTime: 100, // ms
    windowMargin: 80, // pixels
    enlargeFactor: 1.25,
    preventDragClass: '.drag-stop', // add this class to pip children that should not trigger drag/resize
    width: 320,
    height: 180,
  },
}
