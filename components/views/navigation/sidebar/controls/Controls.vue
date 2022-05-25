<template src="./Controls.html" />

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
    ...mapState(['audio', 'video', 'webrtc', 'accounts']),
    audioMuted(): boolean {
      return this.audio.muted
    },
    videoMuted(): boolean {
      return p2p.id && this.webrtc.streamMuted[p2p.id]?.video
    },
    screenMuted(): boolean {
      return p2p.id && this.webrtc.streamMuted[p2p.id]?.screen
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
      this.$store.dispatch('audio/toggleMute', {}, { root: true })
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
