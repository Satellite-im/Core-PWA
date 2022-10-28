<template>
  <div class="user-list hover-scroll">
    <TypographyText size="sm" color="body" class="heading">
      {{
        $t('pages.chat.members', { count: allParticipantsAlphaSorted.length })
      }}
    </TypographyText>
    <div class="list">
      <button
        v-for="user in allParticipantsAlphaSorted"
        :key="user.did"
        class="user"
        @click="showQuickProfile($event, user)"
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
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { computed, ComputedRef } from 'vue'
import { conversationHooks } from '~/components/compositions/conversations'
import { User } from '~/libraries/Iridium/users/types'

const { $route, $store } = useNuxtApp()
const conversationId: ComputedRef<string | undefined> = computed(() => {
  return $route.params.id
})

const { allParticipantsAlphaSorted } = conversationHooks(conversationId.value)

function showQuickProfile(e: MouseEvent, user: User) {
  $store.commit('ui/setQuickProfile', {
    user,
    position: { x: e.x, y: e.y },
  })
}
</script>

<style lang="less" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 12px;
  width: 240px;
  margin-right: 16px;
  overflow-y: auto;
  background: @foreground-gradient;
  box-shadow: @ui-shadow;
  user-select: none;
  border-radius: @corner-rounding;

  .heading {
    padding: 16px 16px 0;
  }

  .list {
    display: flex;
    flex-direction: column;
  }

  .user {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 16px;

    &:hover {
      .background-semitransparent-lighter();
    }
  }
}
</style>
