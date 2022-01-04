import { MediaState } from './types'

export default {
  toggleMediaIncomingCall(state: MediaState, id: String) {
    state.incomingCall = id
  },
}
