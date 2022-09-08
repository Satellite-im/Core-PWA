<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { formatDuration } from '~/utilities/duration'

export default Vue.extend({
  components: {
    MaximizeIcon,
    MinimizeIcon,
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callTimeString: '',
    }
  },
  watch: {
    webrtc: {
      handler() {
        this.callTimeString = this.$dayjs(this.webrtc.callStartedAt).toNow(true)
      },
      deep: true,
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
