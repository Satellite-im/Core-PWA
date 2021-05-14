interface SettingsState {
  audioInput: string
  audioOutput: string
  noiseSuppression: Boolean
  echoCancellation: Boolean
  bitrate: Number
  sampleSize: Number
  userHasGivenAudioAccess: Boolean
  userDeniedAudioAccess: Boolean
}

const InitalSettingsState: SettingsState = {
  audioInput: '',
  audioOutput: '',
  noiseSuppression: true,
  echoCancellation: true,
  bitrate: 96000,
  sampleSize: 24,
  userHasGivenAudioAccess: false,
  userDeniedAudioAccess: false,
}

export default InitalSettingsState
