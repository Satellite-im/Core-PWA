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
import VideoComponent from './Video.vue'
import { AudioStreamUtils } from '~/utilities/AudioStreamUtils'
import { User } from '~/libraries/Iridium/users/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { Call, CallPeerStreams } from '~/libraries/WebRTC/Call'
import { WebRTCActiveCall } from '~/libraries/Iridium/webrtc/types'

export default Vue.extend({
  name: 'MediaUser',
  components: {
    VideoIcon,
    VideoOffIcon,
    MicIcon,
    MicOffIcon,
    VideoComponent,
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
    stream: {
      type: String,
      required: true,
    },
    size: {
      type: Array,
      required: true,
    },
    hideTalkingIndicator: {
      type: Boolean,
      default: false,
    },
    isPresenter: {
      type: Boolean,
      default: false,
    },
    isPresenterThumbnail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isTalking: false,
      audioStreamUtils: null as AudioStreamUtils | null,
      settings: iridium.settings.state,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
    }),
    activeCall(): WebRTCActiveCall | null {
      return iridium.webRTC.state.activeCall
    },
    call(): Call | undefined {
      if (!iridium.webRTC.state.activeCall?.callId) return
      return iridium.webRTC.state.calls[iridium.webRTC.state.activeCall.callId]
    },
    streams(): CallPeerStreams | undefined {
      if (!this.user.did || !this.call) return
      return this.call?.streams[this.user.did]
    },
    src(): string {
      const hash = this.user.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    isLocal(): boolean {
      return this.user.did === iridium.connector?.id
    },
    flipVideo(): boolean {
      return (
        this.isLocal &&
        this.stream === 'video' &&
        this.settings.video.flipLocalStream
      )
    },
    isPending(): boolean {
      return Boolean(
        this.user.did !== iridium.id &&
          iridium.webRTC.state.activeCall &&
          !iridium.webRTC.state.callStartedAt,
      )
    },
    audioStream(): MediaStream | undefined {
      if (this.isMuted(WebRTCEnum.AUDIO) || !this.call) return
      return this.streams?.audio
    },
    videoStream(): MediaStream | undefined {
      if (this.isMuted(WebRTCEnum.VIDEO) || !this.call) return
      return this.streams?.video
    },
    screenStream(): MediaStream | undefined {
      if (this.isMuted(WebRTCEnum.SCREEN) || !this.call) return undefined
      return this.streams?.screen
    },
    hasVideoOrScreen(): boolean {
      return !this.isMuted(WebRTCEnum.VIDEO) || !this.isMuted(WebRTCEnum.SCREEN)
    },
    circleSize(): number {
      const height = this.size[1] as number
      return Math.min(96, height / 2)
    },
  },
  watch: {
    audioStream(stream: MediaStream | undefined) {
      this.initializeAudioStreamUtils(stream)
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
  mounted() {
    this.initializeAudioStreamUtils(this.audioStream)
    this.$emit('mounted')
  },
  beforeDestroy() {
    this.audioStreamUtils?.destroy()
  },
  methods: {
    initializeAudioStreamUtils(stream: MediaStream | undefined) {
      this.audioStreamUtils?.destroy()
      if (!stream) {
        this.isTalking = false
        return
      }
      this.audioStreamUtils = new AudioStreamUtils(stream, this.audio)
      this.audioStreamUtils.start()
    },
    isMuted(kind: WebRTCEnum) {
      const muted =
        !this.user.did ||
        Boolean(iridium.webRTC.state.streamMuted[this.user.did]?.[kind])
      return muted
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
