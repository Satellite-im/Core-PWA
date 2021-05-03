import { NuxtState } from '@nuxt/types/app'

interface SettingsState {
  audioInput: string
  audioOutut: string
  noiseSuppression: Boolean
  echoCancellation: Boolean
}

export const InitalSettingsState: SettingsState = {
  audioInput: 'default',
  audioOutut: 'default',
  noiseSuppression: true,
  echoCancellation: true,
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
}

export const state = () => ({
  ...InitalSettingsState,
})
