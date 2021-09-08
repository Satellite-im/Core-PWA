interface MediaState {
  incomingCall: String
  activeCall: String
}

const InitialMediaState = (): MediaState => ({
  incomingCall: 'Phoenix Kalindi',
  activeCall: '0x0',
})

export default InitialMediaState
