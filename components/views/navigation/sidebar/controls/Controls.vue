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
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'
import { PeerMutedState } from '~/store/webrtc/types'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'
const p2p = Peer2Peer.getInstance()

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
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
      webrtc: (state) => (state as RootState).webrtc,
      accounts: (state) => (state as RootState).accounts,
    }),
    audioMuted(): boolean {
      return this.audio.muted
    },
    videoMuted(): boolean {
      return this.inCall ? this.video.disabled : false
    },
    screenMuted(): boolean {
      return p2p.id && this.webrtc.streamMuted[p2p.id]?.screen
    },
    inCall(): boolean {
      return this.webrtc.activeCall !== undefined
    },
  },
  methods: {
    /**
     * @method toggleMute DocsTODO
     * @description
     * @example
     */
    async toggleMute(kind: keyof PeerMutedState) {
      this.isLoading = true
      try {
        if (kind === WebRTCEnum.AUDIO) {
          await this.$store.dispatch('audio/toggleMute')
        } else if (kind === WebRTCEnum.VIDEO && this.inCall) {
          await this.$store.dispatch('video/toggleMute')
        }
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
      this.isLoading = false
    },
    async toggleDeafen() {
      this.isLoading = true
      this.$store.dispatch('audio/toggleDeafen', {}, { root: true })
      this.isLoading = false
    },
  },
})
</script>

<style scoped lang="less" src="./Controls.less"></style>
