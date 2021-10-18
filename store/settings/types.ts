export enum KeybindTypes {
  toggleMute = 'alt+m',
  toggleDeafen = 'alt+d',
  openSettings = 'alt+s',
  callActiveChat = 'alt+c',
}
export interface SettingsState {
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
