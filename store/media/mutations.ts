import { MediaState } from './types'

export default {
  toggleIncomingCall(state: MediaState, id: String) {
    state.incomingCall = id
  },
}
