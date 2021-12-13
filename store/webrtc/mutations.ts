import { WebRTCState } from './types'

const mutations = {
  setInitialized(state: WebRTCState, initialized: boolean) {
    state.initialized = initialized
  },
  toggleIncomingCall(state: WebRTCState, id: string) {
    state.incomingCall = id
  },
  toggleActiveCall(state: WebRTCState, id: string) {
    state.activeCall = id
  },
  setLocalStream(state: WebRTCState, stream: MediaStream) {
    state.localStream = stream
  },
  setRemoteStream(state: WebRTCState, stream: MediaStream) {
    state.remoteStream = stream
  },
}

export default mutations
