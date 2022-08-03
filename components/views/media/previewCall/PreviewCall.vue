<template src="./PreviewCall.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  data() {
    return {
      chat: iridium.chat,
      webrtc: iridium.webRTC,
    }
  },
  computed: {
    conversationId() {
      return this.webrtc.state.activeCall?.callId
    },
    participant() {
      return this.chat.getOtherParticipants(this.conversationId)[0]
    },
  },
  beforeDestroy() {},
  async mounted() {},
  methods: {},
})
</script>

<style scoped lang="less" src="./PreviewCall.less"></style>
