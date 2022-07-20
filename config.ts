// eslint-disable-next-line import/named
import { Commitment, clusterApiUrl } from '@solana/web3.js'

const soundsCID = 'QmYUAkVMKNKLZiSbLm4eAbF4NR3xk2eLAetTa1aRZYcTu9'

export const Config = {
  debug: true,
  iridium: {
    syncNodes: [
      {
        label: 'Satellite.im Sync Node',
        peerId:
          process.env.NUXT_ENV_IRIDIUM_SYNC_PEER_ID ||
          '12D3KooWQ3jkKp2rm42mC5h4mH5hjg9MfBUad8kjQkLokB2uXmd1',
        multiaddr:
          process.env.NUXT_ENV_IRIDIUM_SYNC_ADDR ||
          '/ip4/127.0.0.1/tcp/4003/ws/p2p/12D3KooWQ3jkKp2rm42mC5h4mH5hjg9MfBUad8kjQkLokB2uXmd1',
      },
    ],
    ipfs: {
      config: {
        Addresses: {
          API: '/dns4/ipfs.infura.io/tcp/5001/https',
          Gateway: '/dns4/satellite.infura-ipfs.io/tcp/443/https',
          RemotePinning: ['/dns4/satellite.infura-ipfs.io/tcp/443/https'],
          Swarm: [
            '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
            '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',
            '/dns4/relay.satellite.im/tcp/443/wss/p2p-webrtc-star',
          ],
        },
        Bootstrap: [
          `/ip4/127.0.0.1/tcp/15003/ws/p2p/${process.env.NUXT_ENV_IRIDIUM_LOCAL_RELAY}`,
          `/ip4/127.0.0.1/tcp/8000/p2p/${process.env.NUXT_ENV_IRIDIUM_LOCAL_RELAY}`,
          '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',
          '/dns4/relay.satellite.im/tcp/443/wss/p2p-webrtc-star',
        ],
      },
    },
  },
  textile: {
    localURI: 'http://localhost:6007',
    key: process.env.NUXT_ENV_TEXTILE_API_KEY,
    browser:
      process.env.NUXT_ENV_TEXTILE_BROWSER || 'https://hub.edge.satellite.one',
    apiUrl:
      process.env.NUXT_ENV_TEXTILE_API_URL ||
      'https://webapi.hub.edge.satellite.one',
    groupChatThreadID:
      'bafkv7ordeargenxdutqdltvlo6sbfcfdhuvmocrt4qe6kpohrdbrbdi',
    bucketIndex: 'sat.json',
    personalBucket: 'personal-files',
    sharedBucket: 'shared-files',
  },
  ipfs: {
    gateway: 'https://satellite.infura-ipfs.io/ipfs/',
  },
  indexedDbName: 'SatelliteDB',
  // Keep in sync with Sounds enum in SoundManager.ts
  sounds: {
    doesLoop: ['call'],
    newMessage: `${soundsCID}/Notification.m4a`,
    call: `${soundsCID}/Call.m4a`,
    hangup: `${soundsCID}/Unused.m4a`,
    mute: `${soundsCID}/Mute.m4a`,
    unmute: `${soundsCID}/Unmute.m4a`,
    deafen: `${soundsCID}/Deafen.m4a`,
    undeafen: `${soundsCID}/Undeafen.m4a`,
    upload: `${soundsCID}/Success.m4a`,
    connected: `${soundsCID}/Success.m4a`,
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
    typingInputThrottle: 2000,
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
    // Regex to check if string contains only emoji's.
    isEmoji:
      /^(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])+$/gi,
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
}
