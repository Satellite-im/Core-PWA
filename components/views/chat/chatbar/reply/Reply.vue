<template src="./Reply.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { XIcon } from 'satellite-lucide-icons'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    XIcon,
  },
  computed: {
    ...mapState(['chat']),
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    replyChatbarName(): string | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return iridium.chat.state.conversations[this.conversationId].name
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
