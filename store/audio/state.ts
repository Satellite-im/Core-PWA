interface AudioState {
  muted: boolean
  deafened: boolean
  volume: number
  inputVolume: number
  previousVolume: number
  sounds: {
    inboundMedia: number
    outboundMedia: number
    system: number
  }
}

const InitialAudioState = (): AudioState => ({
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

export default InitialAudioState
