<template src="./Reply.html"></template>
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
    replyChatbarMessage(): ConversationMessage {
      return this.chat.replyChatbarMessages[this.$route.params.id]
    },
    authorName(): string {
      return iridium.users.getUser(this.replyChatbarMessage.from).name
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
