export interface WebRTCState {
  initialized: boolean
  incomingCall: String
  activeCall: String
  localStream: MediaStream | undefined,
  remoteStream: MediaStream | undefined,
  streaming: Boolean
  activeStream: {
    createdAt: number
  }
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
}
