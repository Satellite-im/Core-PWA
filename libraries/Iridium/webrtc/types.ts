import { SignalData } from 'simple-peer'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { Call } from '~/libraries/WebRTC/Call'

export type PeerMutedState = {
  [key in WebRTCEnum]: boolean
}
export type StreamMutedState = {
  [key: string]: PeerMutedState
}

export type WebRTCActiveCall = {
  callId: string
  did: string
}

export type WebRTCIncomingCall = {
  callId: string
  did: string
  type: 'group' | 'friend'
  data: SignalData
}

export type WebRTCStreamConstraints = {
  audio: boolean
  video: boolean
}
export interface WebRTCState {
  streamMuted: StreamMutedState
  activeCall: WebRTCActiveCall | null
  incomingCall: WebRTCIncomingCall | null
  callTime: number
  callStartedAt: number
  streamConstraints: WebRTCStreamConstraints
  calls: { [key: string]: Call }
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
  PEER_NOT_FOUND = 'errors.webrtc.peer_not_found',
}
