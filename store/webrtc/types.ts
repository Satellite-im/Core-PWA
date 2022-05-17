import { Call } from '~/libraries/WebRTC/Call'

export type PeerMutedState = {
  audio: boolean
  video: boolean
  screen: boolean
}
export type StreamMutedState = {
  [key: string]: PeerMutedState
}

export interface WebRTCState {
  initialized: boolean
  streamMuted: StreamMutedState
  originator: string
  activeCall?: {
    callId: string
    peerId: string
  }
  incomingCall?: {
    callId: string
    peerId: string
    type: 'group' | 'friend'
  }
  createdAt: number
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
  PEER_NOT_FOUND = 'errors.webrtc.peer_not_found',
}
