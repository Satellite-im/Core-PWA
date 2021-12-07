import { MediaState } from './types'

const InitialMediaState = (): MediaState => ({
  incomingCall: '',
  activeCall: '0x0',
  streaming: true,
})

export default InitialMediaState
