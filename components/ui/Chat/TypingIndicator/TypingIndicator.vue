<template src="./TypingIndicator.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  data() {
    return {
      chat: iridium.chat.state,
      typing: iridium.chat.ephemeral.typing,
    }
  },
  computed: {
    typingParticipants(): User[] {
      const conversationId = this.$route.params.id
      if (!conversationId) {
        return []
      }
      const conversation = this.chat.conversations[conversationId]
      if (!conversation) {
        return []
      }
      const conversationTyping = this.typing[conversationId] || []

      return conversationTyping
        .map((did: string) => iridium.users.getUser(did))
        .filter(Boolean)
    },
    text(): string {
      return this.$tc('messaging.typing', this.typingParticipants.length, {
        user: this.typingParticipants.map((u) => u.name).join(', '),
      })
    },
  },
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>
