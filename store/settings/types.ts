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

export enum SettingsError {
  DATABASE_NOT_CLEARED = 'errors.storage.database_not_cleared',
}

export interface SettingsState {
  audioInput: string
  audioOutput: string
  videoInput: string
  captureMouse: string
  noiseSuppression: boolean
  echoCancellation: boolean
  bitrate: number
  sampleSize: number
  userHasGivenAudioAccess: boolean
  userDeniedAudioAccess: boolean
  keybinds: object
  embeddedLinks: boolean
  displayCurrentActivity: boolean
  timezone: string
  removeState: boolean
}
