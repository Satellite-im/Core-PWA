<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    MaximizeIcon,
    MinimizeIcon,
  },
  data() {
    return {
      elapsedTimeLabel: '',
      timer: undefined as NodeJS.Timeout | undefined,
    }
  },
  computed: {
    ...mapState(['ui', 'webrtc']),
  },
  mounted() {
    this.$store.commit('ui/fullscreen', false)
    this.setTimer()
  },
  beforeDestroy() {
    this.clearTimer()
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
    elapsedTime(start: number): void {
      if (!this.webrtc.activeCall || !start) {
        return
      }
      const duration = this.$dayjs.duration(Date.now() - start)
      const hours = duration.hours()
      this.elapsedTimeLabel = `${this.$t('ui.live')} ${
        hours > 0 ? `${hours}:` : ''
      }${duration.format('mm:ss')}`
    },
    setTimer() {
      this.elapsedTime(this.webrtc.createdAt)
      this.timer = setInterval(() => {
        this.elapsedTime(this.webrtc.createdAt)
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
