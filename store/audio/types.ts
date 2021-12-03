export interface AudioState {
  previousVolume: Number
  inputVolume: Number
  muted: Boolean
  volume: Number
  deafened: Boolean
  sounds: {
    inboundMedia: Number
    outboundMedia: Number
    system: Number
  }
}
