import { WebRTCState } from './types'

const mutations = {
  setInitialized(state: WebRTCState, initialized: boolean) {
    state.initialized = initialized
  },
  setIncomingCall(state: WebRTCState, id: string) {
    state.incomingCall = id
  },
  setActiveCall(state: WebRTCState, id: string) {
    state.activeCall = id
  },
  setAllConnectedPeers(state: WebRTCState, ids: string[]) {
    state.connectedPeers = ids
  },
  updateLocalTracks(
    state: WebRTCState,
    tracks: {
      audio?: {
        id: string
        muted: boolean
      }
      video?: {
        id: string
        muted: boolean
      }
    },
  ) {
    state.localTracks = { ...state.localTracks, ...tracks }
  },
  updateRemoteTracks(
    state: WebRTCState,
    tracks: {
      audio?: {
        id: string
        muted: boolean
      }
      video?: {
        id: string
        muted: boolean
      }
    },
  ) {
    state.remoteTracks = { ...state.remoteTracks, ...tracks }
  },
  updateCreatedAt(state: WebRTCState, timestamp: number) {
    state.activeStream.createdAt = timestamp
  },
}

export default mutations
