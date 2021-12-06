import { WebRTCState } from './types'

const InitialWebRTCState = (): WebRTCState => ({
  initialized: false,
  activeStream: {
    createdAt: Date.now(),
  },
})

export default InitialWebRTCState
