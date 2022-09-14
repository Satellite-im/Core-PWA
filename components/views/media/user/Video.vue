<template>
  <video ref="video" :class="`${kind}-stream`" :data-cy="`${kind}-stream`" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { WebRTCActiveCall } from '~/libraries/Iridium/webrtc/types'
import { Call } from '~/libraries/WebRTC/Call'

export default Vue.extend({
  name: 'VideoComponent',
  props: {
    activeCall: {
      type: Object as PropType<WebRTCActiveCall | null>,
      default: null,
    },
    kind: {
      type: String as PropType<string>,
      default: 'video',
    },
    isLocal: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  data() {
    return {
      callInstance: undefined as Call | undefined,
    }
  },
  computed: {},
  mounted() {
    if (!this.activeCall) return
    const { callId, did } = this.activeCall
    if (!callId || !did) return

    this.callInstance = iridium.webRTC.state.calls[callId]

    if (this.isLocal) {
      this.callInstance?.on('LOCAL_TRACK_CREATED', ({ stream, kind }) =>
        this.onTrackReceived({ stream, kind, did }),
      )

      this.callInstance?.on('LOCAL_TRACK_REMOVED', ({ stream, kind }) =>
        this.onTrackRemoved({ stream, kind, did }),
      )
    } else {
      this.callInstance?.on('REMOTE_TRACK_RECEIVED', ({ stream, kind }) =>
        this.onTrackReceived({ did, stream, kind }),
      )

      this.callInstance?.on('REMOTE_TRACK_REMOVED', ({ stream, kind }) =>
        this.onTrackReceived({ did, stream, kind }),
      )
    }
  },
  updated() {},
  beforeDestroy() {
    // this.callInstance?.off(
    //   'REMOTE_TRACK_RECEIVED',
    //   this.onTrackReceived.bind(this),
    // )
    // this.callInstance?.off(
    //   'REMOTE_TRACK_REMOVED',
    //   this.onTrackRemoved.bind(this),
    // )
  },
  methods: {
    onTrackReceived({
      did: streamDid,
      kind,
      stream,
    }: {
      did: string
      kind?: string
      stream: MediaStream
    }) {
      if (kind !== this.kind || this.activeCall?.did !== streamDid) return

      const video = this.$refs.video as HTMLVideoElement
      if (!video) return
      video.srcObject = stream

      this.$nextTick(() => {
        video.play()
      })
    },
    onTrackRemoved({
      did: streamDid,
      kind,
    }: {
      did: string
      kind?: string
      stream: MediaStream
    }) {
      if (kind !== this.kind || this.activeCall?.did !== streamDid) return

      const video = this.$refs.video as HTMLVideoElement
      if (!video) return
      video.srcObject = null
    },
  },
})
</script>

<style scoped lang="less"></style>
