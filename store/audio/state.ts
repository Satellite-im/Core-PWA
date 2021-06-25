interface AudioState {
  muted: Boolean
  deafened: Boolean
  volume: Number
}

const InitalAudioState: AudioState = {
  muted: false,
  deafened: false,
  volume: 100,
}

export default InitalAudioState
