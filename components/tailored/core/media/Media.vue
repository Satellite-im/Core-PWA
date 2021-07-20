<template src="./Media.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['audio']),
  },
  methods: {
    volumeControlValueChange(volume: number) {
      this.$store.commit('setVolume', volume)
    },
  },
})
</script>

<style scoped lang="less" src="./Media.less"></style>
