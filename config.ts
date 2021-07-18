export const Config = {
  debug: false,
  textile: {
    localURI: 'http://localhost:6007',
    key: process.env.TEXTILE_API_KEY,
    browser: 'https://hub.textile.io',
  },
  ipfs: {
    browser: 'https://ipfs.io/ipfs/',
  },
  sounds: {
    newMessage: 'QmfGYjbTXg66V8ZHzqQRVutUFmkbd5L3fV6DA72jTHDWAH',
    call: 'QmRdxeQF53abUesaFC8qmoNJ5FLS8LBuSyCmcXT5VhuKSm',
    hangup: 'QmWrRi5tdKZy3iqcR8mum9hFBbZ8qgvekhEM3Y4PD1TK28',
    mute: 'QmVk362FGmwfsXBj5zMv4x1Hp7Mp9RbYDMxsDXRAx5vyUo',
    unmute: 'QmWxv18LqpcaMhXVd1BLm9z9k1MfWDNexJ22dC6vLkdyro',
    deafen: 'Qmf4QinBSDk9AgvqsiaaZ2ZmhCfTwcSRpAgSCTxLGyZkyg',
    undeafen: 'QmSHtz5kSvX8JNZKMfkm6PjqScxoC864bmGd2g3ycwRqK1',
    upload: 'QmSHtz5kSvX8JNZKMfkm6PjqScxoC864bmGd2g3ycwRqK1',
    connected: 'QmUJMTmCdnzjcUT5nT2eGzXVDYbwDq3CanjKabYQ3Vu3Dt',
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
  },
}
