<template src="./Controls.html"></template>

<script lang="ts">
import Vue from 'vue'

import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  computed: {
    ...mapState(['audio']),
  },
  methods: {
    toggleMute() {
      const muted = this.audio.muted
      if (!muted) this.$Sounds.playSound(Sounds.MUTE)
      else this.$Sounds.playSound(Sounds.UNMUTE)

      this.$store.commit('mute')
    },
    toggleDeafen() {
      const deafened = this.audio.deafened
      if (!deafened) this.$Sounds.playSound(Sounds.DEAFEN)
      else this.$Sounds.playSound(Sounds.UNDEAFEN)

      this.$store.commit('deafen')
    },
  },
})
</script>

<style scoped lang="less" src="./Controls.less"></style>
