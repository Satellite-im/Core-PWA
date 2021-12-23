export enum MessagingTypesEnum {
  REPLY = "reaction",
  REACTION = "reply",
  IMAGE = "image",
  TEXT = "text"
}

export type MessagingType  = keyof typeof MessagingTypesEnum
