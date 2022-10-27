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
  created() {
    setInterval(() => {
      this.getNow()
    }, 1000)
  },
  methods: {
    hangUp() {
      iridium.webRTC.hangUp()
    },
    getNow() {
      const currentTimestamp = Date.now()
      const durationOfCall = currentTimestamp - this.webrtc.callStartedAt
      const formattedDuration = formatDuration(durationOfCall / 1000)

      this.callTimeString = formattedDuration
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
