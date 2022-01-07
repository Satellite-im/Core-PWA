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
    const address = this.$route.params.address
    const { all: friends } = this.$store.state.friends
    if (address) {
      const friend = friends.find((fr) => fr.address === address)
      if (friend) {
        this.$store.dispatch('textile/fetchMessages', { address })
        return
      }
    }
    if (friends.length > 0) {
      this.$router.replace(`/chat/direct/${friends[0].address}`)
      return
    }
    this.$route.replace('/chat/direct')
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
