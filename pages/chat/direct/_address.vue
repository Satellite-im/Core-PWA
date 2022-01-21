<template src="./Direct.html" />

<script lang="ts">
import Vue from 'vue'
import { groupMessages } from '~/utilities/Messaging'
import { ConsoleWarning } from '~/utilities/ConsoleWarning'

export default Vue.extend({
  name: 'DirectMessages',
  layout: 'chat',
  computed: {
    groupedMessages() {
      const { address } = this.$route.params
      const conversation = this.$typedStore.state.textile.conversations[address]

      if (!conversation) {
        return []
      }

      const { messages, replies, reactions } = conversation
      return groupMessages(messages, replies, reactions)
    },
  },
  mounted() {
    // This information can be useful for users to help us find and report bugs.
    ConsoleWarning(this.$config.clientVersion, this.$store.state)
    const { address } = this.$route.params
    const { friends } = this.$store.state
    if (address) {
      if (
        this.$Hounddog &&
        this.$Hounddog.findFriendByAddress(address, friends)
      ) {
        this.$store.dispatch('textile/fetchMessages', { address })
        return
      }
    }
    if (friends && friends.all && friends.all.length > 0) {
      this.$router.replace(`/chat/direct/${friends.all[0].address}`)
      return
    }
    this.$router.replace('/chat/direct')
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
