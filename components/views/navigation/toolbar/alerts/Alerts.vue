<template>
  <div class="alerts">
    <div class="header">
      <TypographyTitle :size="6" :text="$t('pages.chat.mentions')" />
      <InteractablesTextButton @click="clearNotifications">
        {{ $t('ui.clear_all') }}
      </InteractablesTextButton>
    </div>

    <div v-if="mentions.length" class="list">
      <!-- <template v-if="alert.type !== 'EMPTY'"> -->
      <ToolbarAlertsAlert
        v-for="mention in mentions"
        :key="mention.id"
        :mention="mention"
      />
      <!-- </template> -->
    </div>

    <TypographySubtitle v-else :size="6" :text="$t('alerts.caught_up')" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  computed: {
    mentions(): ConversationMessage[] {
      // NOTE: For testing purposes, we're showing all messages until we have a
      //       better way to filter them.
      const mentions = Object.values(iridium.chat.state.conversations)
        .map((conversation: Conversation) =>
          Object.values(conversation.message),
        )
        .flat()

      return mentions
      // return mentions.reverse()
    },
  },
  methods: {
    clearNotifications() {
      return iridium.notifications.deleteAll()
    },
  },
})
</script>

<style scoped lang="less" src="./Alerts.less"></style>
