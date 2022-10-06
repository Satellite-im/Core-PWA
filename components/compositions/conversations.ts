import { computed, ComputedRef, reactive } from 'vue'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { truthy } from '~/utilities/typeGuard'

export function conversationHooks(conversationId?: Conversation['id']) {
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

  const otherParticipants: ComputedRef<User[]> = computed(() => {
    return otherDids.value
      .map((did) => managers.users.getUser(did))
      .filter(truthy)
  })

  const otherTypingParticipants: ComputedRef<User[]> = computed(() => {
    if (!conversationId) {
      return []
    }
    return (
      managers.chat.ephemeral.typing[conversationId]
        ?.map((did) => managers.users.getUser(did))
        .filter(truthy) ?? []
    )
  })

  const allParticipantsAlphaSorted: ComputedRef<User[]> = computed(() => {
    if (!conversation.value) {
      return []
    }
    const arr = conversation.value.participants
      .map((p) => managers.users.getUser(p))
      .filter(truthy)
    return arr.sort((a, b) => a?.name?.localeCompare(b?.name))
  })

  const sortedMessages: ComputedRef<ConversationMessage[]> = computed(() => {
    if (!conversationId) {
      return []
    }
    return Object.values(
      managers.chat.state.conversations[conversationId].message,
    ).sort((a, b) => a.at - b.at)
  })

  const numUnreadMessages: ComputedRef<number> = computed(() => {
    if (!conversationId || !conversation.value) {
      return 0
    }

    let count = 0
    let i = sortedMessages.value.length - 1
    while (sortedMessages.value[i].at < conversation.value?.lastReadAt) {
      count++
      i--
    }

    return count
  })

  return {
    conversation,
    conversationId,
    isGroup,
    otherDids,
    otherParticipants,
    otherTypingParticipants,
    allParticipantsAlphaSorted,
    sortedMessages,
    numUnreadMessages,
  }
}
