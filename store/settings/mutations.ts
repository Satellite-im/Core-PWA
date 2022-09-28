import { SettingsState } from './types'

const mutations = {
  echoCancellation(state: SettingsState, enabled: boolean) {
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
  embeddedLinks(state: SettingsState, value: boolean) {
    state.embeddedLinks = value
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
