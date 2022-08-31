import { computed, ComputedRef } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { TrackKind } from '~/libraries/WebRTC/types'

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

  return { conversation, conversationId, isGroup, otherDids, enableRTC }
}

export async function call(kinds: TrackKind[]) {
  // @ts-ignore
  const $nuxt = useNuxtApp()
  const { enableRTC, otherDids, conversationId } = conversationHooks()

  if (!enableRTC.value) {
    return
  }
  await iridium.webRTC
    .call({
      recipient: otherDids.value[0],
      conversationId: conversationId.value,
      kinds,
    })
    .catch((e) => $nuxt.$toast.error($nuxt.i18n.t(e.message)))
}
