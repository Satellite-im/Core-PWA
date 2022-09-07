<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callTime: iridium.webRTC.callTime,
    }
  },
  computed: {
    remoteParticipant() {
      return iridium.webRTC.remoteParticipants()?.[0] ?? undefined
    },
  },
  methods: {
    navigateToActiveConversation() {
      if (!this.webrtc.activeCall) {
        return
      }

      const id = iridium.chat?.directConversationIdFromDid(
        this.webrtc.activeCall.did,
      )
      if (
        !id ||
        !iridium.chat?.hasConversation(id) ||
        !this.remoteParticipant
      ) {
        return
      }

      this.$router.push(`/mobile/chat/${id}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
