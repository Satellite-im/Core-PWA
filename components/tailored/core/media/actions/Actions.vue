<template src="./Actions.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  computed: {
    ...mapState(['audio']),
  },
  methods: {
    /**
     * @method toggleMute DocsTODO
     * @description
     * @example
     */
    toggleMute() {
      const muted = this.audio.muted
      if (!muted) this.$Sounds.playSound(Sounds.MUTE)
      else this.$Sounds.playSound(Sounds.UNMUTE)

      this.$store.commit('mute')
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
