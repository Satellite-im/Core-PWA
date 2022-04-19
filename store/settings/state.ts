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
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  userHasGivenAudioAccess: false,
  userDeniedAudioAccess: false,
  keybinds: KeybindTypes,
  embeddedLinks: true,
  consentScan: false,
  blockNsfw: true,
  displayCurrentActivity: true,
  removeState: false,
  serverType: 'satellite',
  ownInfo: '',
})

export default InitialSettingsState
