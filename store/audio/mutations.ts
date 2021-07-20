import { NuxtState } from '@nuxt/types/app'

const mutations = {
  mute(state: NuxtState) {
    // We clone a new object here since vuex
    // will not react to deep values
    state.audio = {
      ...state.audio,
      muted: !state.audio.muted,
    }
  },
  deafen(state: NuxtState) {
    state.audio = {
      ...state.audio,
      deafened: !state.audio.deafened,
    }
  },
  setVolume(state: NuxtState, volume: Number) {
    state.audio = {
      ...state.audio,
      volume,
    }
  },
  setInputVolume(state: NuxtState, inputVolume: Number) {
    state.audio = {
      ...state.audio,
      inputVolume,
    }
  },
}

export default mutations
