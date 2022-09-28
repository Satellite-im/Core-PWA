import { AudioState } from './types'

const mutations = {
  mute(state: AudioState) {
    state.muted = !state.muted
  },
  toggleMute(state: AudioState) {
    state.muted = !state.muted
  },
  setMute(state: AudioState, flag: boolean) {
    state.muted = flag
  },
  deafen(state: AudioState) {
    const isDeafened = state.deafened
    state.previousVolume = isDeafened ? state.previousVolume : state.volume
    state.volume = isDeafened ? state.previousVolume : 0
    state.deafened = !isDeafened
  },
  setVolume(state: AudioState, volume: number) {
    state.previousVolume = volume
    state.volume = volume
  },
  setSystemVolume(state: AudioState, systemVolume: number) {
    state.sounds.system = systemVolume
  },
  setInputVolume(state: AudioState, inputVolume: number) {
    state.inputVolume = inputVolume
  },
  setSoundLevel(
    state: AudioState,
    sound: {
      inboundMedia: number
      outboundMedia: number
      system: number
    },
  ) {
    state.sounds = sound
  },
}

export default mutations
