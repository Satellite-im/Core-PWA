<template src="./BackgroundCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useCallElapsedTime, useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

export default Vue.extend({
  setup() {
    const { remoteParticipants } = useWebRTC()
    const { elapsedTime, startInterval, clearTimer } = useCallElapsedTime()

    const remoteParticipant = computed(() => {
      return remoteParticipants.value.length > 0
        ? remoteParticipants.value[0]
        : null
    })

    return {
      remoteParticipant,
      elapsedTime,
      startInterval,
      clearTimer,
    }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  watch: {
    'webrtc.createdAt': {
      handler() {
        this.startInterval()
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    navigateToActiveConversation() {
      const id = iridium.chat?.directConversationIdFromDid(
        this.remoteParticipant.did,
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
