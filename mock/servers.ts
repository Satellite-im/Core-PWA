export type Server = {
  name: string
  address: string
}

export const Servers = [
  {
    name: 'Solana Fans',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    name: 'Satellite.im',
    address: '0x00000000219ab540356cbb839cbe05303d7705fa',
  },
  {
    name: 'Gaming',
    address: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
  },
  {
    name: 'Blockchain Devs',
    address: '0x73bceb1cd57c711feac4224d062b0f6ff338501e',
  },
] as Array<Server>

export const Unreads = [
  {
    name: 'Phoenix Kalindi',
    address: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
    count: 4,
  },
  {
    name: 'Ariel Larissa',
    address: '0xdc76cd25977e0a5ae17155770273ad58648900d3',
    count: 1,
  },
]

export const ServerInfo = {
  groups: [
    {
      name: 'Text Channels',
      channels: [1, 2, 3],
    },
    {
      name: 'Voice Channels',
      channels: [4, 5, 6],
    },
    {
      name: 'Dev Center',
      channels: [0, 7, 8, 9],
    },
  ],
  channels: {
    '0': {
      id: '0',
      type: 'label',
      name: 'github.com/Satellite_im',
    },
    '1': {
      id: '1',
      type: 'feed',
      name: 'feed',
    },
    '2': {
      id: '2',
      type: 'text',
      name: 'general',
    },
    '3': {
      id: '3',
      type: 'text',
      name: 'trade',
    },
    '4': {
      id: '4',
      type: 'voice',
      name: 'General Chatter',
    },
    '5': {
      id: '5',
      type: 'voice',
      name: 'Gaming',
      users: [
        {
          name: 'RetroPronghorn',
          address: '0x43aF5230d1493511fBDeAe0Fbe4C5555E087Bf24',
        },
        {
          name: 'im_eatin_cookies',
          address: '0x5635e06B8655C1455Da640162061c1392DB16357',
        },
        {
          name: 'XileHorizon',
          address: '0xD3312142f90B6002D6CF01A9d858BED4e49Afcf7',
        },
      ],
    },
    '6': {
      id: '6',
      type: 'voice',
      name: 'Development',
    },
    '7': {
      id: '7',
      type: 'text',
      name: 'general',
    },
    '8': {
      id: '8',
      type: 'feed',
      name: 'updates',
    },
    '9': {
      id: '9',
      type: 'voice',
      name: 'Dev Chat',
    },
  },
}
