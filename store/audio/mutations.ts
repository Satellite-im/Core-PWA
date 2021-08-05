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
    const deafened = !state.audio.deafened;
    state.audio = {
      ...state.audio,
      deafened,
      volume: deafened ? 0: state.audio.prevVolume
    }
  },
  setVolume(state: NuxtState, volume: Number) {
    state.audio = {
      ...state.audio,
      volume,
      prevVolume: volume
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
