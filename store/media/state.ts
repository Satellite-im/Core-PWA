interface MediaState {
  incomingCall: String
  activeCall: String
  streaming: Boolean
}

const InitialMediaState = (): MediaState => ({
  incomingCall: 'Phoenix Kalindi',
  activeCall: '0x0',
  streaming: true,
})

export default InitialMediaState
