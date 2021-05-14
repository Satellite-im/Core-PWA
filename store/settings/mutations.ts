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
  noiseSuppression(state: NuxtState, enabled: Boolean) {
    state.settings = {
      ...state.settings,
      noiseSuppression: enabled,
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
  audioInput(state: NuxtState, value: String) {
    state.settings = {
      ...state.settings,
      audioInput: value,
    }
  },
  audioOutput(state: NuxtState, value: String) {
    state.settings = {
      ...state.settings,
      audioOutput: value,
    }
  },
}
