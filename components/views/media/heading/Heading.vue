<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { webrtcHooks } from '~~/components/compositions/webrtc'

export default Vue.extend({
  setup() {
    const { useDuration } = webrtcHooks()

    const callDuration = useDuration()

    return {
      callDuration,
    }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
