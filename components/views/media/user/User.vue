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
import { Call, CallPeerStreams } from '~/libraries/WebRTC/Call'
import { PeerMutedState } from '~/libraries/Iridium/webrtc/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { useWebRTC } from '~/libraries/Iridium/webrtc/hooks'

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
  setup() {
    const { call } = useWebRTC()

    return { call }
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
    muted() {
      return (
        (this.user?.did && this.webrtc.streamMuted[this.user.did]) ?? {
          audio: true,
          video: true,
          screen: true,
        }
      )
    },
    streams() {
      if (!(this.user as User).did || !this.call) return

      return (this.call as Call).streams[(this.user as User).did]
    },
    videoStream() {
      return (
        this.call &&
        !(this.muted as PeerMutedState).video &&
        (this.streams as CallPeerStreams)?.video
      )
    },
    audioStream() {
      return (
        this.call &&
        !(this.muted as PeerMutedState).audio &&
        (this.streams as CallPeerStreams)?.audio
      )
    },
    screenStream() {
      return (
        this.call &&
        !(this.muted as PeerMutedState).screen &&
        (this.streams as CallPeerStreams)?.screen
      )
    },
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
