<template src="./Actions.html" />

<script lang="ts">
import Vue from 'vue'

import {
  VideoIcon,
  VideoOffIcon,
  MicIcon,
  MicOffIcon,
  ScreenShareIcon,
  PhoneOffIcon,
} from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  components: {
    VideoIcon,
    VideoOffIcon,
    MicIcon,
    MicOffIcon,
    ScreenShareIcon,
    PhoneOffIcon,
  },
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

      this.$store.commit('audio/mute')
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

      this.$store.commit('video/toggleCamera')
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
