<template>
  <div class="toolbar">
    <button v-if="conversationId" @click="$emit('slidePrev')">
      <menu-icon class="font-color-flair" size="1.5x" alt="previous" />
    </button>
    <TypographyText as="h3" class="ellipsis">
      {{ conversation?.name }}
    </TypographyText>
    <button
      class="phone"
      :class="{ disabled: !enableRTC || webrtc.activeCall || isGroup }"
      :disabled="!enableRTC || Boolean(webrtc.activeCall)"
      data-cy="toolbar-enable-audio"
      @click="handleCall"
    >
      <phone-call-icon size="1.4x" alt="call" />
    </button>
    <!-- <button
    title="video call"
    :disabled="!enableRTC || webrtc.activeCall"
    data-cy="toolbar-enable-audio"
    @click="handleCall"
  >
    <video-icon size="1.4x" />
  </button> -->
    <template v-if="otherParticipants.length">
      <UiUserState v-if="!isGroup" :user="otherParticipants[0]" />
      <UiGroupIcon v-else :members="conversation?.participants" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, reactive } from 'vue'
import { PhoneCallIcon, MenuIcon } from 'satellite-lucide-icons'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import iridium from '~/libraries/Iridium/IridiumManager'
import { conversationHooks } from '~/components/compositions/conversations'
import { webrtcHooks } from '~/components/compositions/webrtc'

// @ts-ignore
const { $route } = useNuxtApp()
const conversationId: ComputedRef<string | undefined> = computed(() => {
  return $route.params.id
})

const webrtc = reactive(iridium.webRTC.state)

const { conversation, isGroup, otherDids, otherParticipants } =
  conversationHooks(conversationId.value)
const { enableRTC, call } = webrtcHooks(conversationId.value)

async function handleCall() {
  if (isGroup.value || !enableRTC.value || !conversationId.value) {
    return
  }
  await call({
    recipient: otherDids.value[0],
    conversationId: conversationId.value,
    kinds: ['audio'],
  })
}
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
