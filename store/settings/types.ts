export enum KeybindTypes {
  toggleMute = 'alt+m',
  toggleDeafen = 'alt+d',
  openSettings = 'alt+s',
  callActiveChat = 'alt+c',
}

export enum CaptureMouseTypes {
  always = 'always',
  motion = 'motion',
  never = 'never',
}
export interface SettingsState {
  audioInput: string
  audioOutput: string
  videoInput: string
  captureMouse: string
  noiseSuppression: Boolean
  echoCancellation: Boolean
  bitrate: Number
  sampleSize: Number
  userHasGivenAudioAccess: Boolean
  userDeniedAudioAccess: Boolean
  keybinds: Object
  embeddedLinks: Boolean
  displayCurrentActivity: Boolean
  timezone: string
}
