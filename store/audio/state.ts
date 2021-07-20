interface AudioState {
  muted: Boolean
  deafened: Boolean
  volume: Number
  inputVolume: Number
}

const InitalAudioState: AudioState = {
  muted: false,
  deafened: false,
  volume: 100,
  inputVolume: 100,
}

export default InitalAudioState
