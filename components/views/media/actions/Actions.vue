<template src="./Actions.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  VideoIcon,
  VideoOffIcon,
  MicIcon,
  MicOffIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  PhoneOffIcon,
} from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    VideoIcon,
    VideoOffIcon,
    MicIcon,
    MicOffIcon,
    ScreenShareIcon,
    ScreenShareOffIcon,
    PhoneOffIcon,
  },
  data() {
    return {
      isLoading: false,
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
    }),
    audioMuted(): boolean {
      return this.audio.muted
    },
    videoMuted(): boolean {
      return this.video.disabled
    },
    screenMuted(): boolean {
      return Boolean(
        iridium.connector?.id &&
          this.webrtc.streamMuted[iridium.connector?.id]?.screen,
      )
    },
  },
  methods: {
    /**
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example
     */
    async toggleMute(kind: WebRTCEnum) {
      if (!iridium.connector?.id) return

      // TODO: isLoading needs to be kind specific, currently all 3 kinds show loading icon if any of them is loading.
      this.isLoading = true
      try {
        if (kind === WebRTCEnum.AUDIO) {
          await this.$store.dispatch('audio/toggleMute')
        } else if (kind === WebRTCEnum.VIDEO) {
          await this.$store.dispatch('video/toggleMute')
        } else {
          await iridium.webRTC.toggleMute({
            kind,
            did: iridium.connector.id,
          })
        }
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
      this.isLoading = false
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      iridium.webRTC.hangUp()
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
