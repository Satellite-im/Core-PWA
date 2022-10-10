<template>
  <div class="mention">
    <div
      class="info-container"
      @click="notificationLink(mention.conversationId)"
    >
      <div class="head">
        <UiUserState
          v-if="conversation.type === 'direct' && sender && senderStatus"
          :user="sender"
          :conversation-id="conversation.id"
        />
        <UiGroupIcon
          v-else-if="conversation.participants"
          :members="conversation.participants"
          :data-cy="{ 'circle-without-picture': !conversation.participants }"
        />
        <TypographyText class="name">
          {{ sender.name || '' }}
        </TypographyText>
        <TypographyText size="xs" color="dark">
          {{ $dayjs(mention.at).fromNow() }}
        </TypographyText>
      </div>
      <TypographyText class="ellipsis body">
        {{ mention.body || '' }}
      </TypographyText>
    </div>
    <InteractablesClose @click="removeNotification" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import iridium from '~/libraries/Iridium/IridiumManager'
import { User, UserStatus } from '~/libraries/Iridium/users/types'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  props: {
    mention: {
      type: Object as PropType<ConversationMessage>,
      required: true,
    },
  },
  data() {
    return {
      ephemeral: iridium.users.ephemeral,
    }
  },
  computed: {
    sender(): User | undefined {
      return iridium.users.getUser(this.mention.from)
    },
    senderStatus(): UserStatus {
      if (!this.sender) {
        return 'offline'
      }
      return this.ephemeral.status[this.sender.did] || 'offline'
    },
    conversation(): Conversation | undefined {
      if (!this.mention.conversationId) return undefined
      return iridium.chat.getConversation(this.mention.conversationId)
    },
    message(): ConversationMessage | undefined {
      if (!this.mention.id) return undefined
      return this.conversation?.message[this.mention.id]
    },
  },
  methods: {
    removeNotification() {
      iridium.notifications.deleteNotification(this.mention.id as string)
    },
    notificationLink(conversationId?: string) {
      if (!conversationId) return
      const mobileLink = `/mobile/chat/${conversationId}`
      const desktopLink = `/chat/${conversationId}`
      this.$router.push(this.$device.isMobile ? mobileLink : desktopLink)
    },
  },
})
</script>

<style scoped lang="less" src="./Alert.less"></style>
