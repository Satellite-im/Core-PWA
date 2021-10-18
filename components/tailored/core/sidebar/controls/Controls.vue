<template src="./Controls.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  MicIcon,
  MicOffIcon,
  HeadphonesIcon,
  VideoIcon,
  VideoOffIcon,
} from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  components: {
    MicIcon,
    MicOffIcon,
    HeadphonesIcon,
    VideoIcon,
    VideoOffIcon,
  },
  computed: {
    ...mapState(['audio', 'video']),
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

      this.$store.commit('audio/mute')
    },
    /**
     * @method toggleDeafen DocsTODO
     * @description
     * @example
     */
    toggleDeafen() {
      const deafened = this.audio.deafened
      if (!deafened) this.$Sounds.playSound(Sounds.DEAFEN)
      else this.$Sounds.playSound(Sounds.UNDEAFEN)

      this.$store.commit('audio/deafen')
    },
    /**
     * @method toggleVideo DocsTODO
     * @description
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

<style scoped lang="less" src="./Controls.less"></style>
