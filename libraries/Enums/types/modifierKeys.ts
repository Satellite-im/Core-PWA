export enum ModifierKeysEnum {
  SHIFT = 'shift',
  CONTROL = 'control',
  ALT = 'alt',
  META = 'meta',
  TAB = 'tab',
  CAPSLOCK = 'capslock',
}

export type ModifierKeys = keyof typeof ModifierKeysEnum
