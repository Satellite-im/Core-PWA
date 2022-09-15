<template>
  <div class="user-list hover-scroll">
    <TypographyText>
      {{
        $t('pages.chat.members', { count: allParticipantsAlphaSorted.length })
      }}
    </TypographyText>
    <div
      v-for="user in allParticipantsAlphaSorted"
      :key="user.did"
      class="user"
    >
      <UiUserState :user="user" :conversation-id="conversationId" />
      <TypographyText class="ellipsis">
        {{ user.name }}
      </TypographyText>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { conversationHooks } from '~/components/compositions/conversations'

export default Vue.extend({
  setup() {
    const { conversationId, allParticipantsAlphaSorted } = conversationHooks()

    return { conversationId, allParticipantsAlphaSorted }
  },
})
</script>

<style lang="less" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 16px;
  padding: 16px;
  width: 240px;
  overflow-y: auto;
  background: @foreground-gradient;
  box-shadow: @ui-shadow;
  user-select: none;
  border-radius: @corner-rounding;

  .user {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
