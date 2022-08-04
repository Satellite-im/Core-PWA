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
      const hash = this.user.photoHash
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    isPending(): boolean {
      return Boolean(
        this.user.peerId !== iridium.connector?.peerId &&
          this.call &&
          !this.webrtc.createdAt,
      )
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
    audioStream(stream) {
      if (this.requestId) {
        cancelAnimationFrame(this.requestId)
        this.requestId = null
      }
      if (!stream) {
        this.isTalking = false
        return
      }
      this.getMicLevel(stream)
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
    getMicLevel(stream: MediaStream) {
      const audioContext = new AudioContext()
      const gainNode = audioContext.createGain()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

      analyser.smoothingTimeConstant = 0

      microphone.connect(gainNode)
      gainNode.connect(analyser)
      analyser.connect(javascriptNode)
      javascriptNode.connect(audioContext.destination)

      const array = new Uint8Array(analyser.frequencyBinCount)

      const detect = () => {
        // Update gain based on inputVolume
        gainNode.gain.setValueAtTime(
          this.audio.inputVolume / 100,
          audioContext.currentTime,
        )
        this.requestId = requestAnimationFrame(detect)

        analyser.getByteFrequencyData(array)
        let values = 0

        const length = array.length
        for (let i = 0; i < length; i++) {
          values += array[i]
        }

        const average = values / length

        // The micLevel can range between 0 and 100 approximately
        this.isTalking = Math.round(average) > 5
      }

      detect()
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
