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
      buttonsLoading: [] as WebRTCEnum[],
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
    }),
    audioMuted(): boolean {
      return Boolean(iridium.id && this.webrtc.streamMuted[iridium.id]?.audio)
    },
    videoMuted(): boolean {
      return Boolean(iridium.id && this.webrtc.streamMuted[iridium.id]?.video)
    },
    screenMuted(): boolean {
      return Boolean(iridium.id && this.webrtc.streamMuted[iridium.id]?.screen)
    },
  },
  methods: {
    /**
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example
     */
    async toggleMute(kind: WebRTCEnum) {
      if (!iridium.id) return

      this.buttonsLoading.push(kind)
      try {
        if (kind === WebRTCEnum.AUDIO) {
          await this.$store.dispatch('audio/toggleMute')
        } else if (kind === WebRTCEnum.VIDEO) {
          await this.$store.dispatch('video/toggleMute')
        } else {
          await iridium.webRTC.toggleMute({
            kind,
            did: iridium.id,
          })
        }
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
      this.buttonsLoading.splice(this.buttonsLoading.indexOf(kind), 1)
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
