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
    messages: iridium.chat.messages,
  }),
  computed: {
    sortedConversations(): Conversation[] {
      return Object.values(this.conversations).sort(
        (a, b) => this.lastMessageTimestamp(b) - this.lastMessageTimestamp(a),
      )
    },
  },
  methods: {
    navigateAddFriends(): void {
      if (this.$route.name?.includes('friends-list')) {
        if (this.$device.isMobile) {
          this.$store.commit('ui/showSidebar', false)
        }
      } else {
        this.$router.push({ path: '/friends' })
      }
    },
    lastMessageTimestamp(conversation: Conversation): number {
      const messages = this.messages[conversation.id]
      return messages.at(-1)?.at ?? (conversation.updatedAt || 0)
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
