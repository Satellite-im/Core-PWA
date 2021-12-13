import { WebRTCState } from './types'

const InitialWebRTCState = (): WebRTCState => ({
  initialized: false,
  incomingCall: '',
  activeCall: '',
  localStream: undefined,
  remoteStream: undefined,
  activeStream: {
    createdAt: Date.now(),
  },
  streaming: true,
})

export default InitialWebRTCState
