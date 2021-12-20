export enum MessagingTypesEnum {
  REPLY = "reaction",
  REACTION = "reply",
}

export type MessagingType  = keyof typeof MessagingTypesEnum
