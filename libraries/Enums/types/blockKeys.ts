export enum BlockKeysEnum {
  capslock = 'capslock',
  del = 'delete',
}

export type BlockKeys = keyof typeof BlockKeysEnum
