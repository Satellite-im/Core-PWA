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
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { WebRTCEnum } from '~/libraries/Enums/types/webrtc'
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'
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
      return this.webrtc.streamMuted[p2p.id]?.audio
    },
    videoMuted(): boolean {
      return this.webrtc.streamMuted[p2p.id]?.video
    },
    screenMuted(): boolean {
      return this.webrtc.streamMuted[p2p.id]?.screen
    },
  },
  methods: {
    /**
     * @method toggleMute DocsTODO
     * @description
     * @example
     */
    async toggleMute(kind = 'audio') {
      this.isLoading = true
      this.$store.dispatch(
        'webrtc/toggleMute',
        { kind, peerId: p2p.id },
        { root: true },
      )
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
