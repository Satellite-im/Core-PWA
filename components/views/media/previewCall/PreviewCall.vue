<template src="./PreviewCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CornerUpLeftIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

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
  setup() {
    const { remoteParticipants } = useWebRTC()

    const remoteParticipant = computed(() => {
      return remoteParticipants.value.length > 0
        ? remoteParticipants.value[0]
        : null
    })

    return { remoteParticipant }
  },
  methods: {
    navigateToActiveConversation() {
      const conversationId = iridium.webRTC.state.activeCall?.callId
      if (!conversationId) {
        return
      }

      this.$router.push(
        this.$device.isMobile
          ? `mobile/chat/${conversationId}`
          : `/chat/${conversationId}`,
      )
    },
  },
})
</script>

<style scoped lang="less" src="./PreviewCall.less"></style>
