interface AudioState {
  muted: Boolean
  deafened: Boolean
  volume: Number
  prevVolume: Number
  inputVolume: Number
}

const InitalAudioState: AudioState = {
  muted: false,
  deafened: false,
  volume: 100,
  prevVolume: 100,
  inputVolume: 100,
}

export default InitalAudioState
