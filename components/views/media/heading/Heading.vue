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
      callTime: 0,
      formatDuration,
    }
  },
  mounted() {
    setInterval(this.updateCallTime, 1000)
  },
  methods: {
    updateCallTime() {
      this.callTime = iridium.webRTC.callTime
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
