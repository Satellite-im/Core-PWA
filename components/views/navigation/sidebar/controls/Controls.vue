<template src="./Controls.html" />

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
import { WebRTCEnum } from '~/libraries/Enums/types/webrtc'

export default Vue.extend({
  components: {
    MicIcon,
    MicOffIcon,
    HeadphonesIcon,
    VideoIcon,
    VideoOffIcon,
  },
  computed: {
    audioMuted() {
      return this.$store.state.webrtc.localTracks.audio.muted
    },
    videoMuted() {
      return this.$store.state.webrtc.localTracks.video.muted
    },
    ...mapState(['audio', 'video']),
  },
  methods: {
    /**
     * @method toggleMute DocsTODO
     * @description
     * @example
     */
    toggleMute() {
      const muted = this.audioMuted

      const { activeCall } = this.$store.state.webrtc

      const peer = this.$WebRTC.getPeer(activeCall)

      if (muted) {
        peer?.call.unmute('audio')
        this.$Sounds.playSound(Sounds.UNMUTE)
      } else {
        peer?.call.mute('audio')
        this.$Sounds.playSound(Sounds.MUTE)
      }
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
      const muted = this.videoMuted

      const { activeCall } = this.$store.state.webrtc

      const peer = this.$WebRTC.getPeer(activeCall)

      if (muted) {
        peer?.call.unmute(WebRTCEnum.VIDEO)
        this.$Sounds.playSound(Sounds.UNDEAFEN)
      } else {
        peer?.call.mute(WebRTCEnum.VIDEO)
        this.$Sounds.playSound(Sounds.DEAFEN)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Controls.less"></style>
