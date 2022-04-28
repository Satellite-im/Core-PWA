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
     * @method toggleMute DocsTODO
     * @description
     * @example
     */
    async toggleMute() {
      this.isLoading = true
      const muted = this.audioMuted

      const { activeCall } = this.webrtc

      const call = this.$WebRTC.getPeer(activeCall)

      if (call) {
        if (muted) {
          await call.unmute(WebRTCEnum.AUDIO)
          this.$store.dispatch('sounds/playSound', Sounds.UNMUTE)
        } else {
          await call.mute(WebRTCEnum.AUDIO)
          this.$store.dispatch('sounds/playSound', Sounds.MUTE)
        }
      }
      this.isLoading = false
    },
    /**
     * @method toggleDeafen DocsTODO
     * @description
     * @example
     */
    toggleDeafen() {
      this.$store.dispatch('audio/toggleDeafen')
    },
    /**
     * @method toggleVideo DocsTODO
     * @description
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
  },
})
</script>

<style scoped lang="less" src="./Controls.less"></style>
