import { WebRTCEnum } from '~/libraries/Enums/enums'

export type PeerMutedState = {
  [key in WebRTCEnum]: boolean
}
export type StreamMutedState = {
  [key: string]: PeerMutedState
}

export interface WebRTCState {
  streamMuted: StreamMutedState
  activeCall?: {
    callId: string
    peerId: string
  } | null
  incomingCall?: {
    callId: string
    peerId: string
    type: 'group' | 'friend'
  } | null
  createdAt: number
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
  PEER_NOT_FOUND = 'errors.webrtc.peer_not_found',
}
