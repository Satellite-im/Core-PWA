<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    this.handleFullscreen()
    document.addEventListener('fullscreenchange', this.handleFullscreen)
  },
  destroyed() {
    document.removeEventListener('fullscreenchange', this.handleFullscreen)
  },
  methods: {
    toggleFullscreen() {
      if (document.fullscreen) {
        document.exitFullscreen()
      } else {
        const dynamicContent = document.querySelector('.dynamic-content')
        if (dynamicContent) {
          dynamicContent.requestFullscreen()
        }
      }
    },
    handleFullscreen() {
      this.$store.commit('fullscreen', !!document.fullscreenElement)
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
