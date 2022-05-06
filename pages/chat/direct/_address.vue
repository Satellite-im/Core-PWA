<template src="./Direct.html" />

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { groupMessages } from '~/utilities/Messaging'
import { ConsoleWarning } from '~/utilities/ConsoleWarning'

export default Vue.extend({
  name: 'DirectMessages',
  layout: 'chat',
  computed: {
    ...mapGetters('textile', ['getInitialized']),
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
  watch: {
    getInitialized: {
      handler(nextValue) {
        if (nextValue) {
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
          this.$router.replace('/friends/list')
        }
      },
      immediate: true,
    },
  },
})
</script>

<style lang="less" src="./Direct.less"></style>
