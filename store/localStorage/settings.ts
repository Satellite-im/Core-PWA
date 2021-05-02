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
