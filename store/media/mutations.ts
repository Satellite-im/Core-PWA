import { NuxtState } from '@nuxt/types/app'

export default {
  toggleIncomingCall(state: NuxtState, id: String) {
    state.media.incomingCall = id
  },
}
