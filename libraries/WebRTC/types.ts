export enum WebRTCEvents {
  INIT = 'INIT',
  KILL = 'KILL',
}

// Declare empty function arrays here for use in
// event emitters and pubsub methods.
export const WebRTCEventBox = {
  [WebRTCEvents.INIT]: [] as Function[],
  [WebRTCEvents.KILL]: [] as Function[],
}
