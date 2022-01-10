export enum MessagingTypesEnum {
  REPLY = "reply",
  REACTION = "reaction",
  IMAGE = "image",
  TEXT = "text",
  FILE = 'file',
  GROUP = 'group',
  GLYPH = 'glyph',
  DIVIDER = 'divider'
}

export type MessagingType  = keyof typeof MessagingTypesEnum
