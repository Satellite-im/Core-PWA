<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  VideoIcon,
  VideoOffIcon,
  MicIcon,
  MicOffIcon,
} from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useUserStreams, useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

export default Vue.extend({
  components: {
    VideoIcon,
    VideoOffIcon,
    MicIcon,
    MicOffIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    audioMuted: {
      type: Boolean,
      default: false,
    },
    isLocal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { call } = useWebRTC()
    const { streams, getStream } = useUserStreams(props.user.did)

    return {
      call,
      streams,
      audioStream: getStream('audio'),
      videoStream: getStream('video'),
      screenStream: getStream('screen'),
    }
  },
  data() {
    return {
      videoSettings: iridium.settings.state.video,
      webrtc: iridium.webRTC.state,
      isTalking: false,
      requestId: null,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
    }),
    src(): string {
      const hash = this.user.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
  },
  updated() {
    // When audio is streamed, initialize stream volume to current volume.
    if (!this.isLocal && !this.audio.deafened && this.audioStream) {
      const audioStreamElements = document.getElementsByClassName(
        `remote-audio-stream`,
      ) as HTMLCollectionOf<HTMLAudioElement>

      for (const audioStreamElement of audioStreamElements) {
        audioStreamElement.volume = this.audio.volume / 100
      }
    }
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
