import { TextileState } from './types'
import { RootState } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import { Group } from '~/store/groups/types'

const getters = {
  getInitialized: (state: TextileState): boolean => {
    return state.initialized
  },
  getConversation: (state: TextileState) => (address: string) => {
    return state.conversations[address] || null
  },
  getConversationMessages: (state: TextileState) => (address: string) => {
    return state.conversations[address]
      ? Object.values(state.conversations[address].messages)
      : []
  },
  getSortedFriendsAndGroups: (
    state: TextileState,
    getters: any,
    rootState: RootState,
  ): Array<Friend | Group> => {
    const conversations = state.conversations
    const friends = rootState.friends.all
    const groups = rootState.groups.all

    const sortedConversations = Object.fromEntries(
      Object.entries(conversations).sort(
        ([, a], [, b]) => b?.lastUpdate - a?.lastUpdate,
      ),
    )
    const sortedFriendsAndGroups: Array<Friend | Group> = []

    for (const key in sortedConversations) {
      const isGroup = key.split('|')[1]
      if (isGroup) {
        const group = groups.find((gr) => gr.id === key)
        if (group) {
          sortedFriendsAndGroups.push(group)
        }
      } else {
        const friend = friends.find((fr) => fr.address === key)
        if (friend) {
          sortedFriendsAndGroups.push(friend)
        }
      }
    }

    return sortedFriendsAndGroups
  },
}

export default getters
