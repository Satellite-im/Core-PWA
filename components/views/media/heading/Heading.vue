<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useCallElapsedTime } from '~/libraries/Iridium/webrtc/hooks'

export default Vue.extend({
  components: {
    MaximizeIcon,
    MinimizeIcon,
  },
  props: {
    isFullscreen: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { elapsedTime, startInterval, clearTimer } = useCallElapsedTime()
    return { elapsedTime, startInterval, clearTimer }
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
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
