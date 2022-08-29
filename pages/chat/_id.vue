<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

export default Vue.extend({
  name: 'Chat',
  layout: 'desktop',
  setup() {
    const { isActiveCall } = useWebRTC()

    return { isActiveCall }
  },
})
</script>

<style lang="less" src="./Chat.less" scoped></style>
