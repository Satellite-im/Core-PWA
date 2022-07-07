import dayjs from 'dayjs'
import { WebRTCState } from './types'

const mutations = {
  setInitialized(
    state: WebRTCState,
    {
      initialized,
      originator,
    }: { initialized: boolean; originator: string } = {
      initialized: true,
      originator: '',
    },
  ) {
    state.initialized = initialized
    state.incomingCall = undefined
    state.activeCall = undefined
    state.originator = originator
    state.streamMuted = {}
  },
  setIncomingCall(
    state: WebRTCState,
    details: { callId: string; peerId: string; type: 'group' | 'friend' },
  ) {
    state.incomingCall = details
  },
  setActiveCall(
    state: WebRTCState,
    details?: { callId: string; peerId: string },
  ) {
    state.activeCall = details
  },
  updateCreatedAt(state: WebRTCState, createdAt: number) {
    state.createdAt = createdAt
    if (!state.interval && state.createdAt && state.activeCall) {
      state.interval = setInterval(
        () => this.commit('webrtc/updateElapsedTime'),
        1000,
      )
    } else if (state.interval) {
      clearInterval(state.interval)
      state.interval = null
      state.elapsedTime = ''
    }
  },
  setStreamMuted(
    state: WebRTCState,
    {
      peerId,
      audio = true,
      video = true,
      screen = true,
    }: { peerId: string; audio: boolean; video: boolean; screen: boolean },
  ) {
    if (peerId) {
      state.streamMuted = {
        ...state.streamMuted,
        [peerId]: { audio, video, screen },
      }
    }
  },
  setMuted(
    state: WebRTCState,
    { peerId, kind, muted }: { peerId: string; kind: string; muted: boolean },
  ) {
    state.streamMuted = {
      ...state.streamMuted,
      [peerId]: { ...state.streamMuted[peerId], [kind]: muted },
    }
  },
  toggleMute(
    state: WebRTCState,
    { peerId, kind }: { peerId: string; kind: 'audio' | 'video' | 'screen' },
  ) {
    state.streamMuted = {
      ...state.streamMuted,
      [peerId]: {
        ...state.streamMuted[peerId],
        [kind]: !state.streamMuted[peerId][kind],
      },
    }
  },
  updateElapsedTime(state: WebRTCState) {
    const duration = dayjs.duration(Date.now() - state.createdAt)
    const hours = duration.hours()
    state.elapsedTime = `${hours > 0 ? hours + ':' : ''}${duration.format(
      'mm:ss',
    )}`
  },
}

export default mutations
