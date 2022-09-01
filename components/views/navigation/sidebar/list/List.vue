<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  data() {
    return {
      loading: true,
      friends: iridium.friends.state,
      chat: iridium.chat.state,
    }
  },
  computed: {
    conversations(): { [id: string]: Conversation } {
      return iridium.chat.state.conversations
    },
    sortedConversations(): Conversation[] {
      console.info('conversations', this.conversations)
      return Object.values(this.conversations).sort(
        (a, b) => this.lastMessageTimestamp(b) - this.lastMessageTimestamp(a),
      )
    },
  },
  methods: {
    lastMessageTimestamp(conversation: Conversation): number {
      const messages = Object.values(
        iridium.chat.state.conversations[conversation.id].message,
      ).sort((a, b) => a.at - b.at)
      return messages.at(-1)?.at ?? (conversation.updatedAt || 0)
    },
  },
  watch: {
    conversations: {
      handler() {
        this.loading = false
      },
      deep: true,
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
