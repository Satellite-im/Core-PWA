import { MediaState } from './types'
import { ActionsArguments } from '~/types/store/store'

export default {
  handler: () => {},
  acceptCall({ commit }: ActionsArguments<MediaState>) {
    commit('toggleIncomingCall', '')
  },
  denyCall({ commit }: ActionsArguments<MediaState>) {
    commit('toggleIncomingCall', '')
  },
}
