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
import { User } from '~/types/ui/user'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { Call, CallPeerStreams } from '~/libraries/WebRTC/Call'
import { PeerMutedState } from '~/libraries/Iridium/webrtc/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

async function loadVideos() {
  const videos = document.querySelectorAll(
    `.video-stream:not(.loaded)`,
  ) as NodeListOf<HTMLVideoElement>

  await Promise.all(
    Array.from(videos).map(async (video: HTMLVideoElement) => {
      await video?.load()
      await video?.play().catch(() => {
        // video muted/unloaded
      })
      video.classList.add('loaded')
    }),
  )
}

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
    calling: {
      type: Boolean,
      default: false,
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
    call() {
      return (
        this.user?.peerId &&
        this.webrtc.activeCall?.callId &&
        $WebRTC.getCall(this.webrtc.activeCall.callId)
      )
    },
    muted() {
      return (
        (this.user?.peerId && this.webrtc.streamMuted[this.user.peerId]) ?? {
          audio: true,
          video: true,
          screen: true,
        }
      )
    },
    streams() {
      return (
        this.call &&
        this.user?.peerId &&
        (this.call as Call).streams[(this.user as User).peerId as string]
      )
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
      const hash = this.user.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  watch: {
    muted() {},
    streams() {
      document.querySelectorAll('.video-stream.loaded').forEach((video) => {
        video.classList.remove('loaded')
      })
      this.$nextTick(() => {
        loadVideos()
      })
    },
    videoStream(value) {
      document.querySelectorAll('.video-stream.loaded').forEach((video) => {
        video.classList.remove('loaded')
      })
      this.$nextTick(() => {
        loadVideos()
      })
    },
    screenStream() {
      document.querySelectorAll('.video-stream.loaded').forEach((video) => {
        video.classList.remove('loaded')
      })
      this.$nextTick(() => {
        loadVideos()
      })
    },
    audioStream(value) {
      if (!value && this.requestId) {
        cancelAnimationFrame(this.requestId)
        this.requestId = null
        return
      }
      this.startVoiceDetection()
    },
  },
  beforeDestroy() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId)
      this.requestId = null
    }
  },
  mounted() {
    document.querySelectorAll('.video-stream.loaded').forEach((video) => {
      video.classList.remove('loaded')
    })

    this.$nextTick(() => {
      loadVideos()
    })
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
  methods: {
    startVoiceDetection() {
      if (!this.audioStream) {
        return
      }

      const audioContext = new AudioContext()
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(
        this.audioStream,
      )
      const analyser = audioContext.createAnalyser()
      mediaStreamAudioSourceNode.connect(analyser)

      const pcmData = new Float32Array(analyser.fftSize)

      const onFrame = () => {
        analyser.getFloatTimeDomainData(pcmData)
        let sumSquares = 0.0
        for (const amplitude of pcmData) {
          sumSquares += amplitude * amplitude
        }
        const volume = Math.sqrt(sumSquares / pcmData.length)
        this.isTalking = volume > 0.01
        console.log('volume', volume)
        this.requestId = window.requestAnimationFrame(onFrame)
      }
      this.requestId = window.requestAnimationFrame(onFrame)
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
