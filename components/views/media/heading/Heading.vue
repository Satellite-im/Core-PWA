<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { webrtcHooks } from '~/components/compositions/webrtc'

export default Vue.extend({
  setup() {
    const { updateDuration } = webrtcHooks()

    return {
      updateDuration,
    }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callDuration: '',
      timestampInterval: undefined as undefined | NodeJS.Timer,
    }
  },
  created() {
    this.updateLocalDuration()
    this.timestampInterval = setInterval(() => {
      this.updateLocalDuration()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timestampInterval)
  },
  methods: {
    updateLocalDuration() {
      this.callDuration = this.updateDuration()
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
