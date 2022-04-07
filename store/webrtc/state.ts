import { WebRTCState } from './types'

export const initialTracksState = {
  audio: { muted: false },
  video: { muted: false },
}

const InitialWebRTCState = (): WebRTCState => ({
  initialized: false,
  incomingCall: '',
  activeCall: '',
  connectedPeers: [],
  peerCalls: {},
  activeStream: {
    createdAt: 0,
  },
  streaming: true,
  localTracks: initialTracksState,
  remoteTracks: initialTracksState,
})

export default InitialWebRTCState
