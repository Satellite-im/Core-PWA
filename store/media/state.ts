interface MediaState {
  incomingCall: String
  messages: any[]
  activeCall: String
}

const InitialMediaState = (): MediaState => ({
  incomingCall: 'Phoenix Kalindi',
  messages: [],
  activeCall: '0x0',
})

export default InitialMediaState
