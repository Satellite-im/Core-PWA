import { NuxtState } from '@nuxt/types/app'

export default {
  toggleIncomingCall(state: NuxtState, toggle: Boolean) {
    state.media.incomingCall = toggle
  },
}
