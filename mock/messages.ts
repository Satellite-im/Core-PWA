export type Message = {
  id: string
  from: string
  to: string
  at: number
  type: string
  payload: any
}

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
      },
      {
        id: '00-00-11',
        at: 1620515543400,
        type: 'text',
        payload:
          'Doppler shift quasar astronomer conjunction dark matter solar Pluto cosmonaut azimuth inner planets supernova new moon libration',
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
      },
      {
        id: '00-20-04',
        at: 1620515545000,
        type: 'text',
        payload: 'And a follow up to that response message',
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
      },
      {
        id: '00-00-11',
        at: 1620515543400,
        type: 'text',
        payload:
          'NASA precession cislunar dark matter terminator bolometer red shift yellow dwarf white giant north star transparency celestial probe azimuth ephemeris Venus albedo perigee star',
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
        payload:
          'Radiant shooting star wavelength helium local arm penumbra total eclipse Lagrange points nova Doppler shift full moon spectroscope universe sky ionosphere NASA orbital eccentricity superior planets visual magnitude heliocentric',
      },
      {
        id: '00-c0-11',
        at: 1620515543400,
        type: 'image',
        payload: {
          type: 'img/png',
          url: 'https://i.redd.it/buk8te6ried61.png',
        },
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
          'Mir local arm starlight day eccentricity Saturn falling star Mars astronomy gravitation',
      },
      {
        id: '00-00-10',
        at: 1620515543000,
        type: 'audio',
        payload: {
          title: 'Break Away',
          author: 'Test Audio',
          filename: 'breakaway.mp3',
          src: 'https://gateway.pinata.cloud/ipfs/QmTm39rhwcPYMFc788KVBxtM7UNaxoucovFyY21gsmFqz9',
        },
      },
    ],
  },
]
