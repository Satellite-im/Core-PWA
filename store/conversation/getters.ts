import {
  ConversationConnection,
  ConversationParticipant,
  ConversationState,
} from './types'

const getters = {
  /**
   * @method otherParticipants
   * @description get participants other than yourself
   */
  otherParticipants: (state: ConversationState): ConversationParticipant[] => {
    return state.participants.filter((participant) => participant.name != null)
  },
  /**
   * @method onlineParticipants
   * @description array of online participants other than yourself
   */
  onlineParticipants: (
    state: ConversationState,
    getters: { otherParticipants: ConversationParticipant[] },
  ): ConversationParticipant[] => {
    return getters.otherParticipants.filter(
      (participant) => participant.state === ConversationConnection.CONNECTED,
    )
  },
}

export default getters
