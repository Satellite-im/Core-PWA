<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import iridium from '~/libraries/Iridium/IridiumManager'
import { WebRTCState } from '~/store/webrtc/types'

export default Vue.extend({
  components: {
    MaximizeIcon,
    MinimizeIcon,
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
      interval: null,
      elapsedTime: '',
    }
  },
  computed: {
    ...mapState(['ui']),
    // ...mapState('webrtc', ['elapsedTime']),
    activeCall() {
      return this.webrtc.activeCall
    },
    createdAt() {
      return this.webrtc.createdAt
    },
  },
  watch: {
    createdAt() {
      this.startInterval()
    },
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  mounted() {
    this.startInterval()
  },
  methods: {
    /**
     * @method toggleFullscreen
     * @description Toggles fullscreen by committing the opposite of it's current value (this.ui.fullscreen) to fullscreen in state
     * @example @click="toggleFullscreen"
     */
    toggleFullscreen() {
      this.$store.commit('ui/fullscreen', !this.ui.fullscreen)
      const elements = document.querySelectorAll('.full-video')
      if (elements && elements.length > 0 && !this.ui.fullscreen) {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]
          element?.classList.remove('full-video')
        }
      }
    },
    startInterval() {
      if (!this.interval && this.createdAt && this.activeCall) {
        this.interval = setInterval(this.updateElapsedTime, 1000)
      }
    },
    updateElapsedTime() {
      const duration = dayjs.duration(Date.now() - this.webrtc.createdAt)
      const hours = duration.hours()
      this.elapsedTime = `${hours > 0 ? hours + ':' : ''}${duration.format(
        'mm:ss',
      )}`
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
