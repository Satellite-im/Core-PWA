<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { MaximizeIcon, MinimizeIcon } from 'vue-feather-icons'

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
    this.$store.commit('fullscreen', false)
  },
  methods: {
    toggleFullscreen() {
      this.$store.commit('fullscreen', !this.ui.fullscreen)
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
