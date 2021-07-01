import { NuxtState } from '@nuxt/types/app'
import { Friend } from '~/types/ui/core'

const mutations = {
  fetchFriends(state: NuxtState, friends: Array<Friend>) {
    state.friends = {
      ...state.friends,
      all: friends,
    }
  },
}

export default mutations
