interface AudioState {
  muted: Boolean
  deafened: Boolean
  volume: Number
  inputVolume: Number
  previousVolume: Number
  sounds: {
    inboundMedia: Number
    outboundMedia: Number
    system: Number
  }
}

const InitalAudioState = (): AudioState => ({
  muted: false,
  deafened: false,
  volume: 100,
  inputVolume: 100,
  previousVolume: 0,
  sounds: {
    inboundMedia: 100,
    outboundMedia: 100,
    system: 100,
  },
})

export default InitalAudioState
