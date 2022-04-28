export enum MessagingTypesEnum {
  REPLY = 'reply',
  REACTION = 'reaction',
  IMAGE = 'image',
  TEXT = 'text',
  FILE = 'file',
  GROUP = 'group',
  GLYPH = 'glyph',
  DIVIDER = 'divider',
  STRING = 'string',
}

export type MessagingType = keyof typeof MessagingTypesEnum
