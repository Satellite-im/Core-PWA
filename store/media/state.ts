import { MediaState } from './types'

const InitialMediaState = (): MediaState => ({
  incomingCall: 'Phoenix Kalindi',
  activeCall: '0x0',
  streaming: true,
})

export default InitialMediaState
