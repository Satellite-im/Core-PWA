<template src="./Actions.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Sounds } from '~/utilities/SoundManager/SoundManager'

export default Vue.extend({
  computed: {
    ...mapState(['audio']),
  },
  methods: {
    toggleMute() {
      const muted = this.$store.state.audio.muted
      if (!muted) this.$sounds.playSound(Sounds.Mute)
      if (muted) this.$sounds.playSound(Sounds.Unmute)

      this.$store.commit('mute')
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
