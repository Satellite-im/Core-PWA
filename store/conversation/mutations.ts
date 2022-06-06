import { ConversationParticipant, ConversationState } from './types'

const mutations = {
  setConversation(
    state: ConversationState,
    payload: {
      id: string
      type: 'friend' | 'group'
      participants: Array<ConversationParticipant>
      calling?: boolean
    },
  ) {
    state.id = payload.id
    state.type = payload.type
    state.calling = !!payload.calling
    state.participants = payload.participants || []
  },
  setCalling(state: ConversationState, active: boolean) {
    state.calling = active
  },
  setParticipants(
    state: ConversationState,
    participants: Array<ConversationParticipant>,
  ) {
    state.participants = participants || []
  },
  addParticipant(
    state: ConversationState,
    participant: ConversationParticipant,
  ) {
    state.participants = [...state.participants, participant]
  },
  updateParticipant(
    state: ConversationState,
    participant: ConversationParticipant,
  ) {
    const prev = state.participants.find(
      (p) =>
        p.address === participant.address ||
        (p.peerId && p.peerId === participant.peerId),
    )
    if (!prev) {
      return
    }
    const next = { ...prev, ...participant }

    // avoid updating the participant unless we have to (video blink issue from peer announce)
    if (JSON.stringify(next) === JSON.stringify(prev)) {
      return
    }

    state.participants = state.participants.map((p) => {
      if (
        p.address === participant.address ||
        (p.peerId && p.peerId === participant.peerId)
      ) {
        return next
      }
      return p
    })
  },
}
export default mutations
