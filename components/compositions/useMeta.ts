import { computed, reactive } from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { friendsHooks } from '~/components/compositions/friends'
import { conversationHooks } from '~/components/compositions/conversations'

const useMeta = () => {
  const managers = reactive({
    chat: iridium.chat,
  })

  const { incomingRequests } = friendsHooks()

  const totalUnreadMessages = computed(() => {
    let count = 0

    Object.keys(managers.chat.state.conversations).forEach((conversationId) => {
      const { numUnreadMessages } = conversationHooks(conversationId)
      count += numUnreadMessages.value
    })
    return count
  })

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
