<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'Chat',
  layout: 'chat',
  data() {
    return {
      messages: iridium.chat.conversationMessages[this.$route.params.id],
    }
  },
  computed: {
    // groupedMessages() {
    //   const { address } = this.$route.params
    //   const conversation = this.$typedStore.state.textile.conversations[address]
    //   if (!conversation) return []
    //   const { messages, replies, reactions } = conversation
    //   return groupMessages(messages, replies, reactions)
    // },
  },
})
</script>

<style lang="less" src="./Chat.less"></style>
