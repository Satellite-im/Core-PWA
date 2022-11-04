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
    const collator = new Intl.Collator()
    const arr = conversation.value.participants
      .map((p) => managers.users.getUser(p))
      .filter(truthy)
    return arr.sort((a, b) => collator.compare(a.name, b.name))
  })

  const sortedMessages: ComputedRef<ConversationMessage[]> = computed(() => {
    // todo - fix type definition for ChatManager key value pairs. can be undefined
    if (
      !conversationId ||
      !managers.chat.state.conversations[conversationId]?.message
    ) {
      return []
    }

    return sortConversationMessages(conversationId)
  })

  const numUnreadMessages: ComputedRef<number> = computed(() => {
    if (!conversationId || !conversation.value) {
      return 0
    }

    let count = 0

    for (let i = sortedMessages.value.length - 1; i >= 0; i--) {
      if (sortedMessages.value[i].at > conversation.value.lastReadAt) {
        count++
      } else {
        break
      }
    }

    return count
  })

  // generic hooks that aren't specific to one conversation
  const sortedConversations: ComputedRef<Conversation[]> = computed(() => {
    return Object.values(managers.chat.state.conversations).sort(
      (a, b) => lastMessageTimestamp(b) - lastMessageTimestamp(a),
    )
  })

  const totalUnreadMessages: ComputedRef<number> = computed(() => {
    let count = 0

    Object.keys(managers.chat.state.conversations).forEach((id) => {
      const { numUnreadMessages } = conversationHooks(id)
      count += numUnreadMessages.value
    })
    return count
  })

  // helper functions
  function lastMessageTimestamp(conversation: Conversation): number {
    const messages = sortConversationMessages(conversation.id)
    return messages[messages.length - 1]?.at ?? (conversation.createdAt || 0)
  }

  function sortConversationMessages(
    id: Conversation['id'],
  ): ConversationMessage[] {
    return Object.values(managers.chat.state.conversations[id]?.message).sort(
      (a, b) => a.at - b.at,
    )
  }

  return {
    conversation,
    isGroup,
    otherDids,
    otherParticipants,
    otherTypingParticipants,
    allParticipantsAlphaSorted,
    sortedMessages,
    numUnreadMessages,
    sortedConversations,
    totalUnreadMessages,
  }
}
