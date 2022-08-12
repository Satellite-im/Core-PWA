import { ConversationState } from './types'

export default function InitialConversationState(): ConversationState {
  return {
    id: '',
    type: 'friend',
    calling: false,
    participants: [],
  }
}
