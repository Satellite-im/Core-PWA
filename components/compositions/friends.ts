import { computed, ComputedRef, reactive } from 'vue'
import { FriendRequest } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { truthy } from '~/utilities/typeGuard'

export function friendsHooks() {
  const managers = reactive({
    friends: iridium.friends,
    users: iridium.users,
  })

  const friendsList: ComputedRef<User[]> = computed(() => {
    return managers.friends.state.friends
      .map((did) => managers.users.state[did])
      .filter(truthy)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      )
  })

  const requests: ComputedRef<FriendRequest[]> = computed(() => {
    return Object.values(managers.friends.state.requests).filter(truthy)
  })

  const incomingRequests: ComputedRef<FriendRequest[]> = computed(() => {
    return requests.value.filter(
      (r: FriendRequest) => r.incoming && r.status !== 'accepted',
    )
  })

  const outgoingRequests: ComputedRef<FriendRequest[]> = computed(() => {
    return requests.value.filter(
      (r: FriendRequest) => !r.incoming && r.status === 'pending',
    )
  })

  return {
    friendsList,
    requests,
    incomingRequests,
    outgoingRequests,
  }
}
