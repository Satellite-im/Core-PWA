export enum WebRTCEvents {
  INIT = 'INIT',
  KILL = 'KILL',
}

export type WebRTCEvent = keyof typeof WebRTCEvents

// Declare empty function arrays here for use in
// event emitters and pubsub methods.
export const WebRTCEventBox = {
  [WebRTCEvents.INIT]: [] as Function[],
  [WebRTCEvents.KILL]: [] as Function[],
}

export type WebRTCData = {
  at: Date
  event: WebRTCEvent
  data: any
}
