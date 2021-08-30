
interface MediaState {
  incomingCall: String
  messages: any[]
  unreadMessage: number
  isScrollOver: boolean
}

const InitialMediaState = (): MediaState => ({
  incomingCall: 'Phoenix Kalindi',
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
})

export default InitialMediaState
