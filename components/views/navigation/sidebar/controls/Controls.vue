<template src="./Controls.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  MicIcon,
  MicOffIcon,
  HeadphonesIcon,
  HeadphonesOffIcon,
  VideoIcon,
  VideoOffIcon,
} from 'satellite-lucide-icons'

import { mapState } from 'vuex'
import { PeerMutedState } from '~/libraries/Iridium/webrtc/types'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    MicIcon,
    MicOffIcon,
    HeadphonesIcon,
    HeadphonesOffIcon,
    VideoIcon,
    VideoOffIcon,
  },
  data() {
    return {
      buttonsLoading: [],
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
      accounts: (state) => (state as RootState).accounts,
    }),
    audioMuted(): boolean {
      return this.audio.muted
    },
    videoMuted(): boolean {
      return this.webrtc.activeCall ? this.video.disabled : false
    },
    screenMuted(): boolean {
      return Boolean(iridium.id && this.webrtc.streamMuted[iridium.id]?.screen)
    },
  },
  methods: {
    /**
     * @method toggleMute DocsTODO
     * @description
     * @example
     */
    async toggleMute(kind: keyof PeerMutedState) {
      this.buttonsLoading.push(kind)
      try {
        if (kind === WebRTCEnum.AUDIO) {
          await this.$store.dispatch('audio/toggleMute')
        }
        if (kind === WebRTCEnum.VIDEO && this.webrtc.activeCall) {
          await this.$store.dispatch('video/toggleMute')
        }
        if (kind === WebRTCEnum.HEADPHONES) {
          await this.$store.dispatch('audio/toggleDeafen', {}, { root: true })
        }
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
      this.buttonsLoading.splice(this.buttonsLoading.indexOf(kind), 1)
    },
  },
})
</script>

<style scoped lang="less" src="./Controls.less"></style>
