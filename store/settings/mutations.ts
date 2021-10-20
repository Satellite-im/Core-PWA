import { SettingsState } from './types'

const mutations = {
  echoCancellation(state: SettingsState, enabled: boolean) {
    // We clone a new object here since vuex
    // will not react to deep values
    state.echoCancellation = enabled
  },
  noiseSuppression(state: SettingsState, enabled: boolean) {
    state.noiseSuppression = enabled
  },
  bitrate(state: SettingsState, value: number) {
    state.bitrate = value
  },
  sampleSize(state: SettingsState, value: number) {
    state.sampleSize = value
  },
  audioInput(state: SettingsState, value: string) {
    state.audioInput = value
  },
  audioOutput(state: SettingsState, value: string) {
    state.audioOutput = value
  },
  setKeybinds(state: SettingsState, value: string) {
    state.keybinds = value
  },
  updateKeybinding(state: SettingsState, value: Object) {
    // @ts-ignore
    state.keybinds[value.keybindName] = value.newKeybind
  },
  embeddedLinks(state: SettingsState, value: Boolean) {
    // We clone a new object here since vuex
    // will not react to deep values
    state.embeddedLinks = value
  },
}

export default mutations
