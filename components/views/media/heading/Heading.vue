<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'
import { mapState } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useCallElapsedTime } from '~/libraries/Iridium/webrtc/hooks'

export default Vue.extend({
  components: {
    MaximizeIcon,
    MinimizeIcon,
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
  computed: {
    ...mapState(['ui']),
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
  methods: {
    /**
     * @method toggleFullscreen
     * @description Toggles fullscreen by committing the opposite of it's current value (this.ui.fullscreen) to fullscreen in state
     * @example @click="toggleFullscreen"
     */
    toggleFullscreen() {
      this.$store.commit('ui/fullscreen', !this.ui.fullscreen)
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
