<template src="./Actions.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  computed: {
    ...mapState(['audio', 'video']),
  },
  methods: {
    /**
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example
     */
    toggleMute() {
      const muted = this.audio.muted
      if (!muted) this.$Sounds.playSound(Sounds.MUTE)
      else this.$Sounds.playSound(Sounds.UNMUTE)

      this.$store.commit('mute')
    },
    /**
     * @method toggleVideo
     * @description Toggles outgoing video
     * @example
     */
    toggleVideo() {
      const videoDisabled = this.video.disabled
      if (!videoDisabled) this.$Sounds.playSound(Sounds.DEAFEN)
      else this.$Sounds.playSound(Sounds.UNDEAFEN)

      this.$store.commit('toggleCamera')
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
