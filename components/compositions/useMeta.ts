import { computed } from 'vue'
import { friendsHooks } from '~/components/compositions/friends'
import { conversationHooks } from '~/components/compositions/conversations'

const useMeta = () => {
  const { incomingRequests } = friendsHooks()
  const { totalUnreadMessages } = conversationHooks()

  const totalNotificationCount = computed(() => {
    return totalUnreadMessages.value + incomingRequests.value.length
  })

  // @ts-ignore
  useHead({
    title: computed(() => {
      const pageTitle = 'Satellite.im'

      return totalNotificationCount.value
        ? `(${totalNotificationCount.value}) ${pageTitle}`
        : pageTitle
    }),
  })
}

export default useMeta
