import { Group } from '~/types/ui/core'
import { Config } from '~/config'

export const Groups: Group[] = [
  {
    name: 'Satellite',
    address: 'af2e998e-bc77-4fca-ac0d-561078488c93',
    motd: 'Chatting privately with the world',
    encryptionKey: '0xdf9eb123432451315c75aecd68c21fe3d7f',
    members: [
      '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
      '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    ],
    creator: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
  },
  {
    name: 'Solstice',
    address: 'bd30dd29-402a-46de-90f4-3ef78f4d0f7c',
    motd: "Chillin' in the sun",
    encryptionKey: '0xdf9eb123432451315c75aecd68c21fe3d7f',
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
    address: 'ea92dd9a-21a3-443f-8f1c-db263192a99f',
    motd: 'Amusing universe',
    encryptionKey: '0xdf9eb221234451315c75aecd68c21fe3d7f',
    members: ['0xdc76cd25977e0a5ae17155770273ad58648900d3'],
    // members: [],
    creator: '0xdc76cd25977e0a5ae17155770273ad58648900d3',
  },
]

export const ExampleGroup: Group = {
  name: 'Solstice',
  address: '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
  motd: "Chillin'n in the sun",
  encryptionKey: '0xdf9eb2231345732451315c75aecd68c21fe3d7f',
  members: [],
  creator: '',
}
