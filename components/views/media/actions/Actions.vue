<template src="./Actions.html" />

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
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'
const p2p = Peer2Peer.getInstance()

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
    }
  },
  computed: {
    ...mapState(['audio', 'video', 'webrtc']),
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
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example
     */
    toggleMute(kind = 'audio') {
      this.isLoading = true
      this.$store.dispatch(
        'webrtc/toggleMute',
        { kind, peerId: p2p.id },
        { root: true },
      )
      this.isLoading = false
    },
    /**
     * @method hangUp
     * @description Hangs up active call
     * @example
     */
    hangUp() {
      this.$store.dispatch('webrtc/hangUp', undefined, { root: true })
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less"></style>
