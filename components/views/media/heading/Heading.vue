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
  computed: {
    ...mapState(['ui']),
    ...mapState('webrtc', ['elapsedTime']),
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
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
