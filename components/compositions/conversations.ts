import { computed, ComputedRef } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { TrackKind } from '~/libraries/WebRTC/types'

export function conversationHooks() {
  // @ts-ignore
  const $nuxt = useNuxtApp()
  const conversationId: ComputedRef<string> = computed(() => {
    return $nuxt.$route.params.id
  })

  const conversation: ComputedRef<Conversation | undefined> = computed(() => {
    return iridium.chat.state.conversations[conversationId.value]
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

export async function call({
  recipient,
  conversationId,
  kinds,
}: {
  recipient: User['did']
  conversationId: Conversation['id']
  kinds: TrackKind[]
}) {
  // @ts-ignore
  const $nuxt = useNuxtApp()
  const { enableRTC, otherDids } = conversationHooks()

  if (!enableRTC.value) {
    return
  }
  // todo - refactor to accept multiple recipients for group calls
  await iridium.webRTC
    .call({
      recipient,
      conversationId,
      kinds,
    })
    .catch((e) => $nuxt.$toast.error($nuxt.i18n.t(e.message)))
}
