export const keyboardRegex = /[a-z0-9\t\n /<>?;:"'`!@#$%^&*()[\]{}_+=|\\-]/gm

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPad|iPhone|iPod/.test(navigator.userAgent)

export const specialKeys: { [key: string]: string } = {
  control: isMac ? 'control' : 'ctrl',
  shift: 'shift',
  alt: 'alt',
  option: 'option',
  command: 'command',
  meta: 'meta',
  backspace: 'backspace',
  tab: 'tab',
  enter: 'enter',
  return: 'return',
  capslock: 'capslock',
  esc: 'esc',
  escape: 'escape',
  space: 'space',
  pageup: 'pageup',
  pagedown: 'pagedown',
  end: 'end',
  home: 'home',
  arrowup: 'up',
  arrowright: 'right',
  arrowleft: 'left',
  arrowdown: 'down',
  insert: 'ins',
  delete: 'del',
  plus: 'plus',
}

export const getCorrectKeybind = (keybind: string) => {
  return keybind.replace('control', 'ctrl')
}
