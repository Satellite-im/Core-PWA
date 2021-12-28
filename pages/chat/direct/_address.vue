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
      return groupMessages(messages, replies, reactions, address)
    },
  },
  mounted() {
    // This information can be useful for users to help us find and report bugs.
    ConsoleWarning(this.$config.clientVersion, this.$store.state)
    const address = this.$route.params.address
    if (address) {
      this.$store.dispatch('textile/fetchMessages', { address })
    }
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
