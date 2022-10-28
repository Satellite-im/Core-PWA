<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { formatDuration } from '~/utilities/duration'

export default Vue.extend({
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callDuration: '',
      timestampInterval: undefined as undefined | NodeJS.Timer,
    }
  },
  created() {
    this.updateDuration()
    this.timestampInterval = setInterval(() => {
      this.updateDuration()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timestampInterval)
  },
  methods: {
    updateDuration() {
      const durationOfCall = Date.now() - this.webrtc.callStartedAt
      this.callDuration = formatDuration(durationOfCall / 1000)
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
