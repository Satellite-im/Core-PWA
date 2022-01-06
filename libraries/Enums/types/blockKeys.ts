export enum BlockKeysEnum {
    CAPSLOCK = 'capslock',
    DELETE = 'delete'
}

export type BlockKeys = keyof typeof BlockKeysEnum