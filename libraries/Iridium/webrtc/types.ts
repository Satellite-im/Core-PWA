import { WebRTCEnum } from '~/libraries/Enums/enums'
import { Friend } from '~/libraries/Iridium/friends/types'

export type PeerMutedState = {
  [key in WebRTCEnum]: boolean
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
    // participants: Friend[]
  }
  incomingCall?: {
    callId: string
    peerId: string
    type: 'group' | 'friend'
  }
  createdAt: number
  elapsedTime: string
  interval: ReturnType<typeof setInterval> | null
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
  PEER_NOT_FOUND = 'errors.webrtc.peer_not_found',
}
