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
import { Peer2Peer } from '~/libraries/WebRTC/Libp2p'
import { RootState } from '~/types/store/store'
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
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
      webrtc: (state) => (state as RootState).webrtc,
    }),
    audioMuted(): boolean {
      return this.audio.muted
    },
    videoMuted(): boolean {
      return this.video.disabled
    },
    screenMuted(): boolean {
      return p2p.id && this.webrtc.streamMuted[p2p.id]?.screen
    },
  },
  methods: {
    /**
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example
     */
    toggleMute(kind: WebRTCEnum) {
      this.isLoading = true
      try {
        if (kind === WebRTCEnum.AUDIO) {
          this.$store.dispatch('audio/toggleMute')
        } else if (kind === WebRTCEnum.VIDEO) {
          this.$store.dispatch('video/toggleMute')
        } else {
          this.$store.dispatch(
            'webrtc/toggleMute',
            { kind, peerId: p2p.id },
            { root: true },
          )
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
      this.$store.dispatch('webrtc/hangUp', undefined, { root: true })
    },
  },
})
</script>

<style scoped lang="less" src="./Actions.less">
</style>
