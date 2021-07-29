<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    this.$store.commit('fullscreen', false)
  },
  methods: {
    toggleFullscreen() {
      this.$store.commit('fullscreen', !this.ui.fullscreen)

      const mediaStream: HTMLElement = document.getElementById(
        'mediastream'
      ) as HTMLElement
      const uiScroll: HTMLElement = document.getElementById(
        'ui-scroll'
      ) as HTMLElement

      if (this.ui.fullscreen) {
        mediaStream.style.height = '100%'
        uiScroll.style.height = '0%'
      } else {
        mediaStream.style.height = '16rem'
        uiScroll.style.height = '100%'
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
