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
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapState(['audio', 'video', 'webrtc']),
    audioMuted(): boolean {
      return this.webrtc.localTracks.audio.muted
    },
    videoMuted(): boolean {
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
      this.isLoading = true
      const muted = this.audioMuted

      const { activeCall } = this.webrtc

      const call = this.$WebRTC.getPeer(activeCall)

      if (call) {
        if (muted) {
          call.unmute(WebRTCEnum.AUDIO)
          this.$store.dispatch('sounds/playSound', Sounds.UNMUTE)
        } else {
          call.mute(WebRTCEnum.AUDIO)
          this.$store.dispatch('sounds/playSound', Sounds.MUTE)
        }
      }

      this.isLoading = false
    },
    /**
     * @method toggleVideo
     * @description Toggles outgoing video
     * @example
     */
    async toggleVideo() {
      this.isLoading = true
      const muted = this.videoMuted

      const { activeCall } = this.webrtc
      const call = this.$WebRTC.getPeer(activeCall)

      if (call) {
        if (muted) {
          await call.unmute(WebRTCEnum.VIDEO)
          this.$store.dispatch('sounds/playSound', Sounds.UNDEAFEN)
        } else {
          await call.mute(WebRTCEnum.VIDEO)
          this.$store.dispatch('sounds/playSound', Sounds.DEAFEN)
        }
      }

      this.isLoading = false
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      if (!this.webrtc.activeCall) return
      const call = this.$WebRTC.getPeer(this.webrtc.activeCall)
      call?.hangUp()
      this.$store.dispatch('webrtc/hangUp')
      this.$store.commit('ui/fullscreen', false)
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
