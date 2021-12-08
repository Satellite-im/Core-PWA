export interface WebRTCState {
  initialized: boolean
  activeStream: {
    createdAt: number
  }
}

export enum WebRTCError {
  NOT_INITIALIZED = 'errors.webrtc.not_initialized',
}
