interface SettingsState {
  audioInput: string
  audioOutut: string
  noiseSuppression: Boolean
  echoCancellation: Boolean
  bitrate: Number
  sampleSize: Number
}

const InitalSettingsState: SettingsState = {
  audioInput: 'default',
  audioOutut: 'default',
  noiseSuppression: true,
  echoCancellation: true,
  bitrate: 96000,
  sampleSize: 24,
}

export default InitalSettingsState
