import { Group } from '~/types/ui/core'

export const Groups: Group[] = [
  {
    name: 'Satellite',
    address: '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
    motd: 'Chatting privately with the world',
    members: [
      '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    ],
    // members: [],
    creator: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
  },
  {
    name: 'Solstice',
    address: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    motd: "Chillin' in the sun",
    members: [
      '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
      '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
      '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
    ],
    // members: [],
    creator: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
  },
  {
    name: 'Urania',
    address: '0x07ee55aa48bb72dcc6e9d71256648910de513eca',
    motd: 'Amusing universe',
    members: ['0xdc76cd25977e0a5ae17155770273ad58648900d3'],
    // members: [],
    creator: '0xdc76cd25977e0a5ae17155770273ad58648900d3',
  },
]

export const ExampleGroup: Group = {
  name: 'Solstice',
  address: '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
  motd: "Chillin'n in the sun",
  members: [],
  creator: '',
}
