<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'Chat',
  layout: 'desktop',
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    isActiveCall(): boolean {
      return iridium.webRTC.isActiveCall(this.$route.params.id)
    },
  },
})
</script>

<style lang="less" src="./Chat.less" scoped></style>
