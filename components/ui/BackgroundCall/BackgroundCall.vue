<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callTimeString: '',
    }
  },
  computed: {
    remoteParticipant(): User | undefined {
      return iridium.webRTC.remoteParticipants()?.[0] ?? undefined
    },
  },
  watch: {
    webrtc: {
      handler() {
        this.callTimeString = this.$dayjs(this.webrtc.callStartedAt).toNow(true)
      },
      deep: true,
    },
  },
  methods: {
    navigateToActiveConversation() {
      const conversationId = this.webrtc.activeCall?.callId
      if (!conversationId) {
        return
      }

      this.$router.push(`/mobile/chat/${conversationId}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
