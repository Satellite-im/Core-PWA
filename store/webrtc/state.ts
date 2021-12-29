import { WebRTCState } from './types'

const InitialWebRTCState = (): WebRTCState => ({
  initialized: false,
  incomingCall: '',
  activeCall: '',
  connectedPeer: '',
  activeStream: {
    createdAt: Date.now(),
  },
  streaming: true,
  localTracks: { audio: {}, video: {} },
  remoteTracks: { audio: {}, video: {} },
})

export default InitialWebRTCState
