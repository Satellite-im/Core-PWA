export enum MessagingTypesEnum {
  REPLY = "reply",
  REACTION = "reaction",
  IMAGE = "image",
  TEXT = "text"
}

export type MessagingType  = keyof typeof MessagingTypesEnum
