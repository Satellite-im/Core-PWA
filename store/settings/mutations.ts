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
  videoInput(state: SettingsState, value: string) {
    state.videoInput = value
  },
  captureMouse(state: SettingsState, value: string) {
    state.captureMouse = value
  },
  setKeybinds(state: SettingsState, value: object) {
    state.keybinds = value
  },
  updateKeybinding(state: SettingsState, value: object) {
    // @ts-ignore
    state.keybinds[value.keybindName] = value.newKeybind
  },
  embeddedLinks(state: SettingsState, value: boolean) {
    // We clone a new object here since vuex
    // will not react to deep values
    state.embeddedLinks = value
  },
  setConsentScan(state: SettingsState, value: boolean) {
    state.consentScan = value
  },
  setBlockNsfw(state: SettingsState, value: boolean) {
    state.blockNsfw = value
  },
  displayCurrentActivity(state: SettingsState, value: boolean) {
    state.displayCurrentActivity = value
  },
  setTimezone(state: SettingsState, value: string) {
    state.timezone = value
  },
  removeAppState(state: SettingsState) {
    state.removeState = true
  },
  setServerType(state: SettingsState, value: string) {
    state.serverType = value
  },
  setOwnInfo(state: SettingsState, value: string) {
    state.ownInfo = value
  },
}

export default mutations
