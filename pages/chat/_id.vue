<template>
  <div class="chat" data-cy="chat-page">
    <Toolbar />
    <Media
      v-if="isActiveCall"
      :max-viewable-users="10"
      :fullscreen-max-viewable-users="20"
    />
    <div class="outer-wrapper">
      <div class="inner-wrapper">
        <Conversation />
        <!-- dont remove ref, used in layouts/desktop.vue -->
        <Chatbar ref="chatbar" />
      </div>
      <UserList v-if="isGroup" />
    </div>
  </div>
</template>

<script lang="ts">
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { computed, ComputedRef } from 'vue'
import { conversationHooks } from '~/components/compositions/conversations'
import { webrtcHooks } from '~/components/compositions/webrtc'

export default {
  name: 'Chat',
  layout: 'desktop',
}
</script>
<script setup lang="ts">
const $nuxt = useNuxtApp()
const conversationId: ComputedRef<string> = computed(() => {
  return $nuxt.$route.params.id
})

const { isGroup } = conversationHooks(conversationId.value)
const { isActiveCall } = webrtcHooks(conversationId.value)
</script>

<style lang="less" scoped>
.chat {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-end;
  padding: 16px 0 0 16px;
  min-width: 0;

  .outer-wrapper {
    display: flex;
    overflow: hidden;
    flex-grow: 1;
    padding-bottom: 16px;

    .inner-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding-right: 16px;
    }
  }
}
</style>
