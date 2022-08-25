import { SignalData } from 'simple-peer'
import { WebRTCEnum } from '~/libraries/Enums/enums'

export type PeerMutedState = {
  [key in WebRTCEnum]: boolean
}
export type StreamMutedState = {
  [key: string]: PeerMutedState
}

export interface WebRTCState {
  streamMuted: StreamMutedState
  activeCall: {
    callId: string
    did: string
  } | null
  incomingCall: {
    callId: string
    did: string
    type: 'group' | 'friend'
    data: SignalData
  } | null
  createdAt: number
  streamConstraints: MediaStreamConstraints
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
  PEER_NOT_FOUND = 'errors.webrtc.peer_not_found',
}
