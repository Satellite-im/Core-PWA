export const windowsShortcuts = [
  'ctrl+n',
  'ctrl+c',
  'ctrl+v',
  'ctrl+shift+n',
  'ctrl+t',
  'ctrl+shift+t',
  'ctrl+tab',
  'ctrl+escape',
  'ctrl+pagedown',
  'ctrl+shift+tab',
  'ctrl+pageup',
  'ctrl+1',
  'ctrl+2',
  'ctrl+3',
  'ctrl+4',
  'ctrl+5',
  'ctrl+6',
  'ctrl+7',
  'ctrl+8',
  'ctrl+9',
  'alt+home',
  'alt+arrowleft',
  'alt+arrowright',
  'ctrl+w',
  'ctrl+f4',
  'ctrl+shift+w',
  'alt+f4',
  'alt+space+n',
  'alt+space+x',
  'alt+f+x',
  'ctrl+arrowright',
  'ctrl+arrowleft',
  'alt+f',
  'alt+e',
  'ctrl+shift+b',
  'ctrl+shift+o',
  'ctrl+h',
  'ctrl+j',
  'shift+escape',
  'shift+alt+t',
  'f1',
  'f3',
  'f5',
  'f6',
  'f7',
  'f10',
  'f11',
  'f12',
  'ctrl+f',
  'ctrl+g',
  'ctrl+shift+g',
  'ctrl+shift+j',
  'ctrl+shift+delete',
  'ctrl+shift+m',
  'alt+shift+i',
  'ctrl+f6',
  'alt+shift+a',
  'ctrl+p',
  'ctrl+s',
  'ctrl+r',
  'escape',
  'tab',
  'shift+tab',
  'ctrl+o',
  'ctrl+u',
  'ctrl+d',
  'ctrl+shift+d',
  'ctrl++',
  'ctrl+-',
  'ctrl+0',
  'space',
  'pagedown',
  'shift+space',
  'pageup',
  'home',
  'end',
  'ctrl+arrowleft',
  'ctrl+arrowright',
  'ctrl+backspace',
  'alt+home',
]

export const macShortcuts = [
  'meta+n',
  'meta+c',
  'meta+v',
  'meta+a',
  'meta+r',
  'meta+shift+n',
  'meta+t',
  'meta+l',
  'meta+shift+t',
  'meta+alt+arrowright',
  'meta+alt+arrowleft',
  'meta+1',
  'meta+2',
  'meta+3',
  'meta+4',
  'meta+5',
  'meta+6',
  'meta+7',
  'meta+8',
  'meta+9',
  'meta+[',
  'meta+]',
  'meta+arrowleft',
  'meta+arrowright',
  'meta+w',
  'meta+shift+w',
  'meta+m',
  'meta+h',
  'meta+q',
  'meta+arrowright',
  'meta+arrowleft',
  'meta+shift+b',
  'meta+alt+b',
  'meta+,',
  'meta+y',
  'meta+shift+j',
  'meta+f',
  'meta+g',
  'meta+shift+g',
  'meta+e',
  'meta+alt+i',
  'meta+shift+delete',
  'meta+shift+m',
  'control+f2',
  'meta+alt+arrowup',
  'meta+alt+shift+i',
  'f7',
  'f11',
  'f12',
  'meta+alt+shift+a',
  'meta+p',
  'meta+s',
  'meta+alt+p',
  'meta+shift+r',
  'escape',
  'tab',
  'shift+tab',
  'meta+o',
  'meta+alt+u',
  'meta+alt=j',
  'meta+d',
  'meta+shift+d',
  'meta+control+f',
  'meta++',
  'meta+-',
  'meta+0',
  'space',
  'shift+space',
  'meta+alt+f',
  'alt+arrowleft',
  'alt+arrowright',
  'alt+delete',
  'meta+shift+h',
  'meta+0',
]

export const charToCode = {
  CR: 13,
  ESC: 27,
}

export const keyCodeToKey: { [key: number]: string } = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Ctrl',
  18: 'Alt',
  19: 'Pause/Break',
  20: 'Caps Lock',
  27: 'Esc',
  32: 'Space',
  33: 'Page Up',
  34: 'Page Down',
  35: 'End',
  36: 'Home',
  37: 'Left',
  38: 'Up',
  39: 'Right',
  40: 'Down',
  45: 'Insert',
  46: 'Delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z',
  91: 'Windows',
  93: 'Right Click',
  96: 'Numpad 0',
  97: 'Numpad 1',
  98: 'Numpad 2',
  99: 'Numpad 3',
  100: 'Numpad 4',
  101: 'Numpad 5',
  102: 'Numpad 6',
  103: 'Numpad 7',
  104: 'Numpad 8',
  105: 'Numpad 9',
  106: 'Numpad *',
  107: 'Numpad +',
  109: 'Numpad -',
  110: 'Numpad .',
  111: 'Numpad /',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  144: 'Num Lock',
  145: 'Scroll Lock',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: "'",
}
