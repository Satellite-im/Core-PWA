<template src="./Heading.html" />

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'

import { mapState } from 'vuex'
dayjs.extend(duration)
export default Vue.extend({
  components: {
    MaximizeIcon,
    MinimizeIcon,
  },
  computed: {
    ...mapState(['ui', 'webrtc']),
  },
  data() {
    return {
      elapsed: `${this.$i18n.t('ui.live')} 00:00`,
    }
  },
  mounted() {
    this.$store.commit('ui/fullscreen', false)
    this.timer = false
    this.setTimer()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    /**
     * @method toggleFullscreen
     * @description Toggles fullscreen by commiting the opposite of it's current value (this.ui.fullscreen) to fullscreen in state
     * @example @click="toggleFullscreen"
     */
    toggleFullscreen() {
      this.$store.commit('ui/fullscreen', !this.ui.fullscreen)
    },
    elapsedTime(start: number): string {
      const duration = dayjs.duration(Date.now() - start)
      const hours = duration.hours()
      return `${this.$i18n.t('ui.live')} ${
        hours > 0 ? `${hours}:` : ''
      }${duration.format('mm:ss')}`
    },
    setTimer() {
      if (this.webrtc && this.webrtc.activeStream) {
        if (!this.timerId) {
          this.elapsed = this.elapsedTime(this.webrtc.activeStream.createdAt)
          this.timerId = setInterval(() => {
            this.elapsed = this.elapsedTime(this.webrtc.activeStream.createdAt)
          }, 500)
        }
      }
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timerId)
        this.timer = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
