import { AudioState } from './types'

const mutations = {
  mute(state: AudioState) {
    state.muted = !state.muted
  },
  toggleMute(state: AudioState) {
    state.muted = !state.muted
  },
  deafen(state: AudioState) {
    const isDeafened = state.deafened
    state.previousVolume = isDeafened ? state.previousVolume : state.volume
    state.volume = isDeafened ? state.previousVolume : 0
    state.deafened = !isDeafened
  },
  setVolume(state: AudioState, volume: Number) {
    state.previousVolume = volume
    state.volume = volume
  },
  setSystemVolume(state: AudioState, systemVolume: Number) {
    state.sounds.system = systemVolume
  },
  setInputVolume(state: AudioState, inputVolume: Number) {
    state.inputVolume = inputVolume
  },
  setSoundLevel(
    state: AudioState,
    sound: {
      inboundMedia: Number
      outboundMedia: Number
      system: Number
    },
  ) {
    state.sounds = sound
  },
}

export default mutations
