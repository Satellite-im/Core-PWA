export enum MessagingTypesEnum {
  REPLY = "reply",
  REACTION = "reaction",
}

export type MessagingType  = keyof typeof MessagingTypesEnum
