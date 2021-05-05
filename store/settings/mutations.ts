import { NuxtState } from '@nuxt/types/app'

export default {
  echoCancellation(state: NuxtState, enabled: Boolean) {
    // We clone a new object here since vuex
    // will not react to deep values
    state.settings = {
      ...state.settings,
      echoCancellation: enabled,
    }
  },
  bitrate(state: NuxtState, value: Number) {
    state.settings = {
      ...state.settings,
      bitrate: value,
    }
  },
  sampleSize(state: NuxtState, value: Number) {
    state.settings = {
      ...state.settings,
      sampleSize: value,
    }
  },
}
