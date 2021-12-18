import { MediaState } from './types'

const InitialMediaState = (): MediaState => ({
  incomingCall: '',
  activeCall: '0x0',
  streaming: false,
})

export default InitialMediaState
