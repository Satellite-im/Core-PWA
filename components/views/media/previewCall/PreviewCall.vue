<template src="./PreviewCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CornerUpLeftIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { WebRTCEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  components: {
    CornerUpLeftIcon,
  },
  props: {
    dragging: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    remoteParticipant(): User | undefined {
      return iridium.webRTC.remoteParticipants()?.[0] ?? undefined
    },
    remoteStream(): WebRTCEnum | undefined {
      if (!this.remoteParticipant) {
        return
      }
      const muted = this.webrtc.streamMuted[this.remoteParticipant.did]
      if (!muted) {
        return
      }
      const streams = ['screen', 'video', 'audio'] as WebRTCEnum[]
      const stream = streams.find((stream) => !muted[stream])
      return stream
    },
  },
  methods: {
    navigateToActiveConversation() {
      const conversationId = this.webrtc.activeCall?.callId
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
