export interface AudioState {
  previousVolume: number
  inputVolume: number
  muted: boolean
  volume: number
  deafened: boolean
  sounds: {
    inboundMedia: number
    outboundMedia: number
    system: number
  }
}
