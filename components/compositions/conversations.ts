import { computed, ComputedRef, reactive } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'

export function conversationHooks(
  conversationId: Conversation['id'] | undefined,
) {
  const managers = reactive({
    chat: iridium.chat,
    users: iridium.users,
  })

  const conversation: ComputedRef<Conversation | undefined> = computed(() => {
    if (!conversationId) {
      return
    }
    return managers.chat.state.conversations[conversationId]
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
      if (!conversationId) {
        return []
      }
      return (
        managers.chat.ephemeral.typing[conversationId]?.map((did) =>
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

  return {
    conversation,
    conversationId,
    isGroup,
    otherDids,
    otherParticipants,
    otherTypingParticipants,
    allParticipantsAlphaSorted,
  }
}
