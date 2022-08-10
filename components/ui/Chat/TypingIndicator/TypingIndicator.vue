<template src="./TypingIndicator.html"></template>

<script lang="ts">
import Vue from 'vue'
import { ConversationParticipant } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  data() {
    return {
      chat: iridium.chat,
    }
  },
  computed: {
    typingParticipants() {
      const conversationId = this.$route.params.id
      if (!conversationId) {
        return
      }
      return this.chat.getTypingParticipants(conversationId)
    },
    text(): string {
      if (!this.typingParticipants.length) {
        return ''
      }
      return this.$tc('messaging.typing', this.typingParticipants.length, {
        user: this.typingParticipants
          .map((p: ConversationParticipant) => p.name)
          .join(', '),
      })
    },
  },
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>
