import { WebRTCState } from './types'

const InitialWebRTCState = (): WebRTCState => ({
  initialized: false,
  originator: '',
  incomingCall: undefined,
  activeCall: undefined,
  streamMuted: {},
  createdAt: 0,
})

export default InitialWebRTCState
