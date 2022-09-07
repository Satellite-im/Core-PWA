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
import { User } from '~/libraries/Iridium/users/types'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { Call } from '~/libraries/WebRTC/Call'
import { useWebrtc } from '~/components/compositions/webrtc'

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
    console.log('MANUEL setup')
    const { streams, screenStreams } = useWebrtc()

    return {
      streams,
      screenStreams,
    }
  },
  data() {
    return {
      isTalking: false,
      audioStreamUtils: null as AudioStreamUtils | null,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => (state as RootState).audio,
      video: (state) => (state as RootState).video,
    }),
    call(): Call | undefined {
      if (!iridium.webRTC.state.activeCall?.callId) return
      return iridium.webRTC.state.calls.get(
        iridium.webRTC.state.activeCall.callId,
      )
    },
    // streams(): any {
    //   if (!this.user.did || !this.call) return
    //   return this.call?.streams[this.user.did]
    // },
    src(): string {
      const hash = this.user.photoHash
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    isPending(): boolean {
      return Boolean(
        this.user.did !== iridium.id &&
          iridium.webRTC.state.activeCall &&
          !iridium.webRTC.state.callStartedAt,
      )
    },
    audioStream(): MediaStream | undefined {
      console.log('MANUEL', this.streams)
      if (this.isMuted(WebRTCEnum.AUDIO) || !this.call) return
      return this.streams?.[this.user.did]?.audio
    },
    videoStream(): MediaStream | undefined {
      if (this.isMuted(WebRTCEnum.VIDEO) || !this.call) return
      return this.streams?.[this.user.did]?.video
    },
    screenStream(): MediaStream | undefined {
      if (this.isMuted(WebRTCEnum.SCREEN) || !this.call) return undefined
      return this.streams?.[this.user.did]?.screen
    },
    isLocalVideoFlipped(): boolean {
      return iridium.settings.state.video.flipLocalStream
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
      const muted =
        !this.user.did ||
        Boolean(iridium.webRTC.state.streamMuted[this.user.did]?.[kind])
      console.info('isMuted', kind, this.user, muted)
      return muted
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
