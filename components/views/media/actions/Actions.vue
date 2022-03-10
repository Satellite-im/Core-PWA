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
import { WebRTCEnum } from '~/libraries/Enums/enums'

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
    ...mapState(['audio', 'video', 'webrtc']),
    audioMuted() {
      return this.webrtc.localTracks.audio.muted
    },
    videoMuted() {
      return this.webrtc.localTracks.video.muted
    },
  },
  methods: {
    /**
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example
     */
    toggleMute() {
      const muted = this.audioMuted

      const { activeCall } = this.webrtc

      const peer = this.$WebRTC.getPeer(activeCall)

      if (muted) {
        peer?.call.unmute(WebRTCEnum.AUDIO)
        this.$store.dispatch('sounds/playSound', Sounds.UNMUTE)
        return
      }
      peer?.call.mute(WebRTCEnum.AUDIO)
      this.$store.dispatch('sounds/playSound', Sounds.MUTE)
    },
    /**
     * @method toggleVideo
     * @description Toggles outgoing video
     * @example
     */
    toggleVideo() {
      const muted = this.videoMuted

      const { activeCall } = this.webrtc

      const peer = this.$WebRTC.getPeer(activeCall)

      if (muted) {
        peer?.call.unmute(WebRTCEnum.VIDEO)
        this.$store.dispatch('sounds/playSound', Sounds.UNDEAFEN)
        return
      }
      peer?.call.mute(WebRTCEnum.VIDEO)
      this.$store.dispatch('sounds/playSound', Sounds.DEAFEN)
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      if (!this.webrtc.activeCall) return
      const peer = this.$WebRTC.getPeer(this.webrtc.activeCall)
      peer?.call.hangUp()
      this.$store.dispatch('webrtc/hangUp')
      this.$store.commit('ui/fullscreen', false)
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
