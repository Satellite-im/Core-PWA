import { computed, ComputedRef } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export function conversationHooks() {
  // @ts-ignore
  const $nuxt = useNuxtApp()
  const conversationId: ComputedRef<string> = computed(() => {
    return $nuxt.$route.params.id
  })

  const conversation: ComputedRef<Conversation | undefined> = computed(() => {
    return iridium.chat.state.conversations[conversationId.value] ?? undefined
  })

  const isGroup: ComputedRef<boolean> = computed(() => {
    return conversation.value?.type === 'group'
  })

  const otherDids: ComputedRef<Conversation['participants']> = computed(() => {
    return (
      conversation?.value?.participants.filter(
        (did) => did !== iridium.connector?.id,
      ) ?? []
    )
  })

  const enableRTC: ComputedRef<boolean> = computed(() => {
    return Boolean(
      otherDids.value?.filter(
        (did) => iridium.users.userStatus[did] === 'online',
      ).length,
    )
  })

  return { conversation, isGroup, otherDids, enableRTC }
}
