<template src="./Reply.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { XIcon } from 'satellite-lucide-icons'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    XIcon,
  },
  computed: {
    ...mapState(['chat']),
    replyUserName(): string | undefined {
      const conversationId = this.$route.params.id
      if (!conversationId) {
        return undefined
      }
      return iridium.chat.state.conversations[conversationId].name
    },
    replyChatbarMessage(): ConversationMessage {
      return this.chat.replyChatbarMessages[this.$route.params.id]
    },
  },
  methods: {
    clearReplyChatbarMessage() {
      const conversationId = this.$route.params.id
      this.$store.commit('chat/clearReplyChatbarMessage', { conversationId })
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
