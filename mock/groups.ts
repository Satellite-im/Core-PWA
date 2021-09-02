import { Group } from '~/types/ui/core'

export const Groups: Group[] = [
  {
    name: 'Satellite',
    address: '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
    motd: 'Chatting privatley with the world',
    members: [
      '0x0ED3B01FAF2002beD1434Fce6E47aDa3bD43d213',
      '0xca8d2554190310F0DdAcF8647b700ceAABc4Cb10',
    ],
  },
  {
    name: 'Solstice',
    address: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    motd: "Chillin'n in the sun",
    members: [
      '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
      '0x0ED3B01FAF2002beD1434Fce6E47aDa3bD43d213',
      '0x7cFbE9977E6577117B589e15CeF2f2F6d18F64ff',
      '0xca8d2554190310F0DdAcF8647b700ceAABc4Cb10',
    ],
  },
  {
    name: 'Urania',
    address: '0x07ee55aa48bb72dcc6e9d71256648910de513eca',
    motd: 'Amusing universe',
    members: ['0xb2D822e05176563498901682202A1f9c0F68C93c'],
  },
]

export const ExampleGroup: Group = {
  name: 'Solstice',
  address: '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
  motd: "Chillin'n in the sun",
  members: [],
}
