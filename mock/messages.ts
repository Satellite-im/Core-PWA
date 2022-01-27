import { Config } from '~/config'

export type Message = {
  id: string
  from: string
  to: string
  at: number
  type: string
  payload: any
  pinned: boolean
}

export const PinnedMessages = [
  {
    id: '00-d0-10',
    at: 1620515545000,
    type: 'text',
    from: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    payload:
      'Radiant shooting star wavelength helium local arm penumbra total eclipse Lagrange points nova Doppler shift full moon spectroscope universe sky ionosphere NASA orbital eccentricity superior planets visual magnitude heliocentric',
    replies: [
      {
        id: '01-432-138',
        from: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
        to: '00-d0-10',
        type: 'text',
        at: 1620515583000,
        payload: 'This is a late message reply',
        reactions: [],
      },
    ],
    reactions: [],
  },
  {
    from: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    id: '00-c0-11',
    at: 1620515543400,
    type: 'image',
    payload: {
      type: 'img/png',
      url: 'https://i.redd.it/buk8te6ried61.png',
    },
    replies: [],
    reactions: [],
  },
]

export const Messages = [
  {
    id: '00-00-01',
    at: 1620515543000,
    type: 'group',
    from: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    messages: [
      {
        id: '00-00-10',
        at: 1620515543000,
        type: 'text',
        payload:
          'Cosmic ipsum probe solstice vernal equinox red dwarf libration double star perigee cosmos cislunar hyperbolic orbit pole star black body meteor shower Jupiter transparency',
        replies: [],
        reactions: [],
      },
      {
        id: '00-00-11',
        at: 1620515543400,
        type: 'text',
        payload:
          'Doppler shift quasar astronomer conjunction dark matter solar Pluto cosmonaut azimuth inner planets supernova new moon libration',
        replies: [],
        reactions: [],
      },
      {
        id: '00-123193-10',
        at: 1620515543000,
        type: 'file',
        payload: {
          filename: 'satellite.tar.gz',
          type: 'application/tar',
          size: 19203,
          src: `${Config.ipfs.gateway}QmTm39rhwcPYMFc788KVBxtM7UNaxoucovFyY21gsmFqz9`,
        },
        replies: [],
        reactions: [],
      },
    ],
  },
  {
    id: '45XfMPooGavLsw9Rhs5VP5aX4bboyTQhy9U8qNoMTMa2',
    at: 1620515543000,
    type: 'group',
    from: '45XfMPooGavLsw9Rhs5VP5aX4bboyTQhy9U8qNoMTMa2',
    to: '45XfMPooGavLsw9Rhs5VP5aX4bboyTQhy9U8qNoMTMa2',
    messages: [
      {
        id: '00-00-10',
        at: 1620515543000,
        type: 'text',
        payload:
          'Cosmic ipsum probe solstice vernal equinox red dwarf libration double star perigee cosmos cislunar hyperbolic orbit pole star black body meteor shower Jupiter transparency',
        replies: [],
        reactions: [],
      },
      {
        id: '00-00-11',
        at: 1620515543400,
        type: 'text',
        payload:
          'Doppler shift quasar astronomer conjunction dark matter solar Pluto cosmonaut azimuth inner planets supernova new moon libration',
        replies: [],
        reactions: [],
      },
      {
        id: '00-123193-10',
        at: 1620515543000,
        type: 'file',
        payload: {
          filename: 'satellite.tar.gz',
          type: 'application/tar',
          size: 19203,
          src: `${Config.ipfs.gateway}QmTm39rhwcPYMFc788KVBxtM7UNaxoucovFyY21gsmFqz9`,
        },
        replies: [],
        reactions: [],
      },
    ],
  },
  {
    type: 'divider',
    at: 1620515543400,
  },
  {
    id: '00-00-02',
    at: 1620515543000,
    type: 'group',
    from: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    to: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    messages: [
      {
        id: '00-00-13',
        at: 1620515545000,
        type: 'text',
        payload: 'I am a ~~tast~~ **test**. :smile:',
        replies: [],
        reactions: [],
      },
      {
        id: '00-20-04',
        at: 1620515545000,
        type: 'text',
        payload: 'And a follow up to that response message',
        replies: [],
        reactions: [],
      },
    ],
  },
  {
    id: '00-00-03',
    at: 1620515543000,
    type: 'group',
    from: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    messages: [
      {
        id: '00-00-10',
        at: 1620515543000,
        type: 'text',
        payload:
          'Uranus orbit seeing globular cluster Milky Way quasar total eclipse gas giant penumbra quarter moon sun Kirkwood gaps orbital eccentricity vacuum occultation background radiation helium Mir perihelion Neptune inclination Mars corona circumpolar terrestrial binary star perturbation nebula revolve ',
        replies: [],
        reactions: [],
      },
      {
        id: '00-123193-10',
        at: 1620515543000,
        type: 'file',
        pinned: true,
        payload: {
          filename: 'satellite.tar.gz',
          type: 'application/tar',
          size: 19203,
          src: `${Config.ipfs.gateway}QmTm39rhwcPYMFc788KVBxtM7UNaxoucovFyY21gsmFqz9`,
        },
        replies: [],
        reactions: [],
      },
      {
        id: '00-00-11',
        at: 1620515543400,
        type: 'text',
        payload:
          'NASA precession cislunar dark matter terminator bolometer red shift yellow dwarf white giant north star transparency celestial probe azimuth ephemeris Venus albedo perigee star',
        replies: [],
        reactions: [],
      },
    ],
  },
  {
    id: '00-01-84',
    at: 1620515543000,
    type: 'group',
    from: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    messages: [
      {
        id: '00-00-10',
        at: 1620515543000,
        type: 'video',
        payload: {
          title: 'Big Buck Bunny',
          author: 'The Blender Foundation',
          filename: 'big_buck_bunny.mp4',
          src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        replies: [],
        reactions: [{ emoji: '🔥', reactors: ['Jpanay'] }],
      },
    ],
  },
  {
    type: 'divider',
    at: 1620515543800,
  },
  {
    id: '00-00-08',
    at: 1620515543000,
    type: 'group',
    from: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    to: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    messages: [
      {
        id: '00-d0-10',
        at: 1620515545000,
        type: 'text',
        pinned: true,
        payload:
          'Radiant shooting star wavelength helium local arm penumbra total eclipse Lagrange points nova Doppler shift full moon spectroscope universe sky ionosphere NASA orbital eccentricity superior planets visual magnitude heliocentric',
        replies: [
          {
            id: '01-432-138',
            from: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
            to: '00-d0-10',
            type: 'text',
            at: 1620515583000,
            payload: 'This is a late message reply',
            reactions: [],
          },
        ],
        reactions: [],
      },
      {
        id: '00-c0-11',
        at: 1620515543400,
        type: 'image',
        pinned: true,
        payload: {
          type: 'img/png',
          url: 'https://i.redd.it/buk8te6ried61.png',
        },
        replies: [],
        reactions: [],
      },
    ],
  },
  {
    id: '00-WO-03',
    at: 1620515543000,
    type: 'caret_divider',
  },
  {
    id: '00-CX-03',
    at: 1620515543000,
    type: 'group',
    from: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    messages: [
      {
        id: '00-UM-10',
        at: 1620515543000,
        type: 'text',
        payload:
          'Mir local arm starlight day eccentricity Saturn falling star Mars astronomy gravitation',
        reactions: [],
        replies: [
          {
            id: '02-432-138',
            from: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
            to: '00-00-03',
            type: 'text',
            at: 1620515543000,
            payload: 'This is a message reply',
            reactions: [{ emoji: '🔥', reactors: ['Jpanay'] }],
          },
          {
            id: '02-432-338',
            from: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
            to: '00-00-03',
            type: 'text',
            at: 1620515563000,
            payload: 'This is a message reply',
            reactions: [],
          },
          {
            id: '02-432-338',
            from: '0xdc76cd25977e0a5ae17155770273ad58648913d3',
            to: '00-00-03',
            type: 'text',
            at: 1620515563000,
            payload: 'This is a message reply 3',
            reactions: [],
          },
          {
            id: '02-432-338',
            from: '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
            to: '00-00-03',
            type: 'text',
            at: 1620515563000,
            payload: 'This is a message reply 4',
            reactions: [],
          },
        ],
      },
      {
        id: '00-1293-10',
        at: 1620515543000,
        type: 'audio',
        payload: {
          title: 'Break Away',
          author: 'Test Audio',
          filename: 'breakaway.mp3',
          src: `${Config.ipfs.gateway}QmTm39rhwcPYMFc788KVBxtM7UNaxoucovFyY21gsmFqz9`,
        },
        replies: [],
        reactions: [
          { emoji: '👍', reactors: ['Taurus Nix', 'Stephen Strange'] },
          {
            emoji: '🔥',
            reactors: [
              'Krombopulos Michael',
              'Taurus Nix',
              'Stephen Strange',
              'John Thundergun',
              'Halley Themis',
            ],
          },
          {
            emoji: '🤯',
            reactors: ['Taurus Nix', 'Halley Themis', 'Stephen Strange'],
          },
        ],
      },
    ],
  },
]
