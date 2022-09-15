import { computed, ComputedRef, reactive } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { TrackKind } from '~/libraries/WebRTC/types'

export function conversationHooks() {
  // @ts-ignore
  const $nuxt = useNuxtApp()

  const managers = reactive({
    chat: iridium.chat,
    users: iridium.users,
  })

  // todo - refactor so a conversationId param can be passed in rather than relying on route every time
  const conversationId: ComputedRef<string | undefined> = computed(() => {
    return $nuxt.$route.params.id
  })

  const conversation: ComputedRef<Conversation | undefined> = computed(() => {
    if (!conversationId.value) {
      return
    }
    return managers.chat.state.conversations[conversationId.value]
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

  const otherParticipants: ComputedRef<(User | undefined)[]> = computed(() => {
    return otherDids.value.map((did) => managers.users.getUser(did))
  })

  const otherTypingParticipants: ComputedRef<(User | undefined)[]> = computed(
    () => {
      if (!conversationId.value) {
        return []
      }
      return (
        managers.chat.ephemeral.typing[conversationId.value]?.map((did) =>
          managers.users.getUser(did),
        ) ?? []
      )
    },
  )

  const allParticipantsAlphaSorted: ComputedRef<User[]> = computed(() => {
    if (!conversation.value) {
      return []
    }
    const arr = conversation.value.participants
      .map((p) => managers.users.getUser(p))
      .filter((item): item is User => Boolean(item))
    return arr.sort((a, b) => a?.name?.localeCompare(b?.name))
  })

  const enableRTC: ComputedRef<boolean> = computed(() => {
    return Boolean(
      otherDids.value?.filter(
        (did) => managers.users.ephemeral.status[did] === 'online',
      ).length,
    )
  })

  return {
    conversation,
    conversationId,
    isGroup,
    otherDids,
    otherParticipants,
    otherTypingParticipants,
    allParticipantsAlphaSorted,
    enableRTC,
  }
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
  const { enableRTC } = conversationHooks()

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

export default function useConversation() {
  return {
    ...conversationHooks(),
    call,
  }
}
