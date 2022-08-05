<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  data: () => ({
    conversations: iridium.chat.state.conversations,
  }),
  computed: {
    sortedConversations(): Conversation[] {
      return Object.values(this.conversations).sort(
        (a, b) => this.lastMessageTimestamp(b) - this.lastMessageTimestamp(a),
      )
    },
  },
  methods: {
    navigateAddFriends() {
      this.$router.push({
        path: this.$device.isMobile ? '/mobile/friends' : '/friends',
      })
    },
    lastMessageTimestamp(conversation: Conversation): number {
      const messages = Object.values(
        this.conversations[conversation.id].message,
      ).sort((a, b) => a.at - b.at)
      return messages.at(-1)?.at ?? (conversation.updatedAt || 0)
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
