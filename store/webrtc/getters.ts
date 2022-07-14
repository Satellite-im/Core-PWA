import { WebRTCState } from './types'

const getters = {
  isActiveCall: (state: WebRTCState): boolean => {
    if (!state.activeCall?.callId) {
      return false
    }
    const conversationId = $nuxt.$route.params.address || $nuxt.$route.params.id
    if (!conversationId) {
      return false
    }
    return state.activeCall.callId === conversationId
  },

  isBackgroundCall: (state: WebRTCState): boolean => {
    if (!state.activeCall?.callId) {
      return false
    }
    const conversationId = $nuxt.$route.params.address || $nuxt.$route.params.id
    if (!conversationId) {
      return true
    }
    return state.activeCall.callId !== conversationId
  },
}

export default getters
