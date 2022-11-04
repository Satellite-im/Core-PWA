import { computed, watch } from 'vue'
import { friendsHooks } from '~/components/compositions/friends'
import { conversationHooks } from '~/components/compositions/conversations'

const useMeta = () => {
  const { incomingRequests } = friendsHooks()
  const { totalUnreadMessages } = conversationHooks()

  const totalNotificationCount = computed(() => {
    return totalUnreadMessages.value + incomingRequests.value.length
  })

  watch(totalNotificationCount, () => {
    const pageTitle = 'Satellite.im'

    document.title = totalNotificationCount.value
      ? `(${totalNotificationCount.value}) ${pageTitle}`
      : pageTitle
  })
}

export default useMeta
