
interface MediaState {
  incomingCall: String
  messages: any[]
  unreadMessage: number
}

const InitialMediaState = (): MediaState => ({
  incomingCall: 'Phoenix Kalindi',
  messages: [],
  unreadMessage: 0,
})

export default InitialMediaState
