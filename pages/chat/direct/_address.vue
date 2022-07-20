<template src="./Direct.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  name: 'Direct',
  layout: 'chat',
  data() {
    return {
      conversationMessages: iridium.chat.conversationMessages,
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
    // Get the active friend
    // messages() {
    // TODO: fetch messages from backend
    // -------
    // const id = await iridium.chat.directConversationId(this.$route.params.address)
    // const msgs = (await iridium.chat.loadMessages(id)) || []
    // console.log('debug: | messages | msgs', msgs)
    // },
    messages(): ConversationMessage[] {
      return this.conversationMessages[this.$route.params.address]
    },
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
