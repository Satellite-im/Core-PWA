import { WebRTCState } from './types'

const InitialWebRTCState = (): WebRTCState => ({
  initialized: false,
  incomingCall: '',
  activeCall: '',
  connectedPeers: [],
  activeStream: {
    createdAt: 0,
  },
  streaming: true,
  localTracks: { audio: {}, video: {} },
  remoteTracks: { audio: {}, video: {} },
})

export default InitialWebRTCState
