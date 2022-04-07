import { Call } from '~/libraries/WebRTC/Call'

export interface WebRTCState {
  initialized: boolean
  incomingCall: string
  activeCall: string
  connectedPeers: string[]
  streaming: Boolean
  peerCalls: {
    [key: string]: Call
  }
  activeStream: {
    createdAt: number
  }
  remoteTracks: {
    audio: {
      id?: string
      muted?: boolean
    }
    video: {
      id?: string
      muted?: boolean
    }
  }
  localTracks: {
    audio: {
      id?: string
      muted?: boolean
    }
    video: {
      id?: string
      muted?: boolean
    }
  }
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
  PEER_NOT_FOUND = 'errors.webrtc.peer_not_found',
}
