export enum KeybindTypes {
  toggleMute = 'alt+m',
  toggleDeafen = 'alt+d',
  openSettings = 'alt+s',
  callActiveChat = 'alt+c',
}
interface SettingsState {
  audioInput: string
  audioOutput: string
  noiseSuppression: Boolean
  echoCancellation: Boolean
  bitrate: Number
  sampleSize: Number
  userHasGivenAudioAccess: Boolean
  userDeniedAudioAccess: Boolean
  keybinds: Object
}

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
})

export default InitalSettingsState
