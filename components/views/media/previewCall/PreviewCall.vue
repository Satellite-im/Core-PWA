<template src="./PreviewCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CornerUpLeftIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    CornerUpLeftIcon,
  },
  props: {
    dragging: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  methods: {
    navigateToActiveConversation() {
      const conversationId = iridium.webRTC.state.activeCall?.callId
      if (!conversationId) {
        return
      }

      this.$router.push(
        this.$device.isMobile
          ? `/mobile/chat/${conversationId}`
          : `/chat/${conversationId}`,
      )
    },
  },
})
</script>

<style scoped lang="less" src="./PreviewCall.less"></style>
