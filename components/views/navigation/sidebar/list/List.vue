<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  data() {
    return {
      chat: iridium.chat.state,
      users: iridium.users.state,
    }
  },
  computed: {
    sortedConversations(): Conversation[] {
      return Object.values(this.chat.conversations).sort(
        (a, b) => this.lastMessageTimestamp(b) - this.lastMessageTimestamp(a),
      )
    },
  },
  methods: {
    lastMessageTimestamp(conversation: Conversation): number {
      const messages = Object.values(
        this.chat.conversations[conversation.id].message,
      ).sort((a, b) => a.at - b.at)
      return messages.at(-1)?.at ?? (conversation.updatedAt || 0)
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
