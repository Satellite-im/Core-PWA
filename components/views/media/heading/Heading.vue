<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'

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
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callTime: iridium.webRTC.callTime,
    }
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
