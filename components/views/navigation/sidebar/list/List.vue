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
      const conversations = Object.values(this.conversations)
      conversations.sort(
        (a, b) => this.lastMessageTimestamp(b) - this.lastMessageTimestamp(a),
      )
      return conversations
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
      if (messages.length === 0) {
        return conversation.updatedAt || 0
      }
      const lastMessage = messages[messages.length - 1]
      return lastMessage.at || 0
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
