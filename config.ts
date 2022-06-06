// eslint-disable-next-line import/named
import { Commitment, clusterApiUrl } from '@solana/web3.js'

export const Config = {
  debug: true,
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
    fsTable: 'sat.json',
    bucketName: 'personal-files',
  },
  ipfs: {
    gateway: 'https://satellite.mypinata.cloud/ipfs/',
  },
  indexedDbName: 'SatelliteDB',
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
    customFaucet: 'https://faucet.satellite.one',
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
  },
  account: {
    minimumAccountLength: 5,
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
    type: 'base64',
    circle: false,
    size: { width: 600, height: 600 },
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
}
