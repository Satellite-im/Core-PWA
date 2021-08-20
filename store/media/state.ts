
interface MediaState {
  incomingCall: String
  messages: any[]
}

const InitialMediaState = (): MediaState => ({
  incomingCall: 'Phoenix Kalindi',
  messages: [],
})

export default InitialMediaState
