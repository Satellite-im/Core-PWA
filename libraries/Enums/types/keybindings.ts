export enum KeybindingEnum {
  // special keys
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_UP = 'ArrowUp',
  BACKSPACE = 'Backspace',
  CONTROL = 'Control',
  DELETE = 'Delete',
  DOWN = 'Down',
  END = 'End',
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  HOME = 'Home',
  LEFT = 'Left',
  RIGHT = 'Right',
  SHIFT = 'SHIFT',
  SPACEBAR = 'Spacebar',
  SPACE = ' ',
  UP = 'Up',
  PAGE_UP = 'PageUp',
  PAGE_DOWN = 'PageDown',

  // alphabet
  A = 'A',
  a = 'a',
  x = 'x',
  z = 'z',
}

export type KeyBinding = keyof typeof KeybindingEnum
