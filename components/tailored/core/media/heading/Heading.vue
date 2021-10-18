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
  },
  mounted() {
    this.$store.commit('ui/fullscreen', false)
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
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
