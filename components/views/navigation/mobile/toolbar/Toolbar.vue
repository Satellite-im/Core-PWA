<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue, { computed, ComputedRef } from 'vue'
import {
  PhoneCallIcon,
  UserPlusIcon,
  MenuIcon,
  VideoIcon,
} from 'satellite-lucide-icons'

import iridium from '~/libraries/Iridium/IridiumManager'
import { conversationHooks } from '~/components/compositions/conversations'
import { webrtcHooks } from '~/components/compositions/webrtc'

export default Vue.extend({
  components: {
    PhoneCallIcon,
    UserPlusIcon,
    MenuIcon,
    VideoIcon,
  },
  setup() {
    // @ts-ignore
    const $nuxt = useNuxtApp()
    const conversationId: ComputedRef<string | undefined> = computed(() => {
      return $nuxt.$route.params.id
    })

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

    return {
      conversation,
      isGroup,
      enableRTC,
      otherParticipants,
      handleCall,
    }
  },

  data() {
    return {
      webrtc: iridium.webRTC.state,
      chat: iridium.chat.state,
    }
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
