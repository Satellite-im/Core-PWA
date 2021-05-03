import { NuxtState } from '@nuxt/types/app'

interface SettingsState {
  audioInput: string
  audioOutut: string
  noiseSuppression: Boolean
  echoCancellation: Boolean
  bitrate: Number
  sampleSize: Number
}

export const InitalSettingsState: SettingsState = {
  audioInput: 'default',
  audioOutut: 'default',
  noiseSuppression: true,
  echoCancellation: true,
  bitrate: 96000,
  sampleSize: 24,
}

export const SettingsMutations = {
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

export const state = () => ({
  ...InitalSettingsState,
})
