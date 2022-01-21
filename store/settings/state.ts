import { SettingsState, KeybindTypes, CaptureMouseTypes } from './types'

const InitialSettingsState = (): SettingsState => ({
  audioInput: '',
  audioOutput: '',
  videoInput: '',
  captureMouse: CaptureMouseTypes.always,
  noiseSuppression: true,
  echoCancellation: true,
  bitrate: 96000,
  sampleSize: 24,
  userHasGivenAudioAccess: false,
  userDeniedAudioAccess: false,
  keybinds: KeybindTypes,
  embeddedLinks: true,
  displayCurrentActivity: true,
  timezone: '',
})

export default InitialSettingsState
