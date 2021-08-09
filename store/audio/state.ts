interface AudioState {
  muted: Boolean
  deafened: Boolean
  volume: Number
  inputVolume: Number
  previousVolume: Number
}

const InitalAudioState: AudioState = {
  muted: false,
  deafened: false,
  volume: 100,
  inputVolume: 100,
  previousVolume: 0,
}

export default InitalAudioState
