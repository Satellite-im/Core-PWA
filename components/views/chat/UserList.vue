<template>
  <div class="user-list hover-scroll">
    <TypographyText size="sm" color="body">
      {{
        $t('pages.chat.members', { count: allParticipantsAlphaSorted.length })
      }}
    </TypographyText>
    <div class="list">
      <div
        v-for="user in allParticipantsAlphaSorted"
        :key="user.did"
        class="user"
      >
        <UiUserState :user="user" :conversation-id="conversationId" />
        <TypographyText
          class="ellipsis"
          font="heading"
          weight="bold"
          color="dark"
        >
          {{ user.name }}
        </TypographyText>
      </div>
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
  gap: 8px;
  padding: 16px;
  width: 240px;
  margin-right: 16px;
  overflow-y: auto;
  background: @foreground-gradient;
  box-shadow: @ui-shadow;
  user-select: none;
  border-radius: @corner-rounding;

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .user {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
