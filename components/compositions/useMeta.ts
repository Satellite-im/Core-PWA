import { computed, reactive } from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { truthy } from '~/utilities/typeGuard'
import { FriendRequest } from '~/libraries/Iridium/friends/types'

const useMeta = () => {
  // @ts-ignore
  const $nuxt = useNuxtApp()
  const titleBase = $nuxt.$i18n.t('global.name') as string

  const friendsState = reactive(iridium.friends.state)
  const incomingRequestsLength = computed(
    () =>
      Object.values(friendsState.requests)
        .filter(truthy)
        .filter((r: FriendRequest) => r?.status === 'pending' && r.incoming)
        .length,
  )

  const chatState = reactive(iridium.chat.state)
  const unreadCount = computed(() =>
    Object.values(chatState.unreadCounts).reduce((a, b) => a + b, 0),
  )

  // @ts-ignore
  useHead({
    title: computed(() => {
      const incomingRequests = incomingRequestsLength.value || 0
      const unread = unreadCount.value || 0
      if (incomingRequests > 0 || unread > 0) {
        return `(${incomingRequests + unread}) ${titleBase}`
      }
      return titleBase
    }),
  })
}

export default useMeta
