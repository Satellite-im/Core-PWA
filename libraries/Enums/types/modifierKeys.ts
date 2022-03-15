export enum ModifierKeysEnum {
  shift = 'shift',
  ctrl = 'ctrl',
  alt = 'alt',
  meta = 'meta',
  tab = 'tab',
  option = 'option',
}

export type ModifierKeys = keyof typeof ModifierKeysEnum
