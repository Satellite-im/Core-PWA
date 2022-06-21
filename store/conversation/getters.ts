import {
  ConversationActivity,
  ConversationConnection,
  ConversationParticipant,
  ConversationState,
} from '~/store/conversation/types'
import { RootState } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import { Group } from '~/store/groups/types'

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
  /**
   * @method typingParticipants
   * @description array of online participants other than yourself
   */
  typingParticipants: (
    state: ConversationState,
    getters: { otherParticipants: ConversationParticipant[] },
  ): ConversationParticipant[] => {
    return getters.otherParticipants.filter(
      (participant) => participant.activity === ConversationActivity.TYPING,
    )
  },
  /**
   * @method isGroup
   * @description is current recipient group
   */
  isGroup(state: ConversationState) {
    return state.type === 'group'
  },
  /**
   * @method recipient
   * @description current recipient full info
   */
  recipient: (
    state: ConversationState,
    getters: any,
    rootState: RootState,
  ): Friend | Group | undefined => {
    return getters.isGroup
      ? rootState.groups.all.find((group: Group) => group.id === state.id)
      : rootState.friends.all.find(
          (friend: Friend) => friend.peerId === state.id,
        )
  },
}

export default getters
