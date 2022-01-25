export enum MessageRouteEnum {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export type MessageRoute = keyof typeof MessageRouteEnum
