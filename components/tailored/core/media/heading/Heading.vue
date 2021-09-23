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
    /**
     * @method toggleFullscreen DocsTODO
     * @description
     * @example
     */
    toggleFullscreen() {
      this.$store.commit('fullscreen', !this.ui.fullscreen)
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
