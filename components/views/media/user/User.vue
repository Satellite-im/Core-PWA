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
import { AudioStreamUtils } from '~/utilities/AudioStreamUtils'
import { User } from '~/libraries/Iridium/friends/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { WebRTCEnum } from '~/libraries/Enums/enums'

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
  data() {
    return {
      webrtc: iridium.webRTC.state,
      videoSettings: iridium.settings.state.video,
      isTalking: false,
      audioStreamUtils: null as AudioStreamUtils | null,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
    }),
    call() {
      if (!this.webrtc.activeCall?.callId) return
      return $WebRTC.getCall(this.webrtc.activeCall.callId)
    },
    streams() {
      if (!this.user.did || !this.call) return
      return this.call.streams[this.user.did]
    },
    src(): string {
      const hash = this.user.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    isPending(): boolean {
      return Boolean(
        this.user.did !== iridium.connector?.id &&
          this.webrtc.activeCall &&
          !this.webrtc.callStartedAt,
      )
    },
    audioStream() {
      if (this.isMuted('audio') || !this.call) return
      return this.streams?.audio
    },
    videoStream() {
      if (this.isMuted('video') || !this.call) return
      return this.streams?.video
    },
    screenStream() {
      if (this.isMuted('screen') || !this.call) return
      return this.streams?.screen
    },
  },
  watch: {
    audioStream(stream) {
      this.audioStreamUtils?.destroy()

      if (!stream) {
        this.isTalking = false
        return
      }

      this.audioStreamUtils = new AudioStreamUtils(stream, this.audio)
      this.audioStreamUtils.start()
    },
    'audioStreamUtils.isTalking'(isTalking) {
      this.isTalking = isTalking
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
  beforeDestroy() {
    this.audioStreamUtils?.destroy()
  },
  methods: {
    isMuted(kind: WebRTCEnum) {
      return (
        !this.user.did ||
        Boolean(this.webrtc.streamMuted[this.user.did]?.[kind] ?? true)
      )
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
