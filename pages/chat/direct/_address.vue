<template src="./Direct.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'Direct',
  layout: 'chat',
  data() {
    return {
      messages: iridium.chat.conversationMessages[this.$route.params.address],
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
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
