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
    const isDeafened = state.audio.deafened
    state.audio = {
      ...state.audio,
      previousVolume: isDeafened
        ? state.audio.previousVolume
        : state.audio.volume,
      volume: isDeafened ? state.audio.previousVolume : 0,
      deafened: !isDeafened,
    }
  },
  setVolume(state: NuxtState, volume: Number) {
    state.audio = {
      ...state.audio,
      previousVolume: volume,
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
