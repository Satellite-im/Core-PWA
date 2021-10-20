import { SettingsState, KeybindTypes } from './types'

const InitalSettingsState = (): SettingsState => ({
  audioInput: '',
  audioOutput: '',
  noiseSuppression: true,
  echoCancellation: true,
  bitrate: 96000,
  sampleSize: 24,
  userHasGivenAudioAccess: false,
  userDeniedAudioAccess: false,
  keybinds: KeybindTypes,
  embeddedLinks: true,
})

export default InitalSettingsState
