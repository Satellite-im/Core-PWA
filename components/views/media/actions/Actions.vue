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
     * @method toggleMute
     * @description Toggles mute for outgoing audio
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
     * @method toggleVideo
     * @description Toggles outgoing video
     * @example
     */
    toggleVideo() {
      const muted = this.videoMuted

      const { activeCall } = this.$store.state.webrtc

      const peer = this.$WebRTC.getPeer(activeCall)

      if (muted) {
        this.$Sounds.playSound(Sounds.UNDEAFEN)
        peer?.call.unmute('video')
      } else {
        this.$Sounds.playSound(Sounds.DEAFEN)
        peer?.call.mute('video')
      }
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      const peer = this.$WebRTC.getPeer(this.$store.state.webrtc.activeCall)
      peer?.call.hangUp()
      this.$store.dispatch('webrtc/hangUp')
      this.$store.commit('ui/fullscreen', false)
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
