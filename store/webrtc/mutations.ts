import { WebRTCState } from './types'
import { Call } from '~/libraries/WebRTC/Call'

const mutations = {
  setInitialized(state: WebRTCState, initialized: boolean) {
    state.initialized = initialized
    state.incomingCall = ''
    state.activeCall = ''
    state.connectedPeers = []
    state.peerCalls = {}
    state.activeStream = { createdAt: 0 }
    state.streaming = false
  },
  setIncomingCall(state: WebRTCState, id: string) {
    state.incomingCall = id
  },
  setActiveCall(state: WebRTCState, id: string) {
    state.activeCall = id
  },
  addConnectedPeer(state: WebRTCState, id: string) {
    state.connectedPeers = [...state.connectedPeers, id]
  },
  removeConnectedPeer(state: WebRTCState, id: string) {
    state.connectedPeers = state.connectedPeers.filter(
      (peerId) => peerId !== id,
    )
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
  setPeerCall(
    state: WebRTCState,
    { call, identifier }: { call: Call; identifier: string },
  ) {
    state.peerCalls = { ...state.peerCalls, [identifier]: call }
  },
}

export default mutations
