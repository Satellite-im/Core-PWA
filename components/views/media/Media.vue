<template src="./Media.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { Call } from '~/libraries/WebRTC/Call'
import { RootState } from '~/types/store/store'

type OptimalBoxDomensionsParams = {
  containerWidth: number
  containerHeight: number
  numBoxes: number
  aspectRatio: number
  gap: number
  // minBoxWidth: number
}

export default Vue.extend({
  props: {
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
    maxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
    fullscreenMaxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
      isFullscreen: false,
      resizeObserver: null as ResizeObserver | null,
      mediaUserSize: [160, 90],
      windowHeight: window.innerHeight,
    }
  },
  computed: {
    ...mapState({
      callHeight: (state) => (state as RootState).ui.callHeight,
      volume: (state) => (state as RootState).audio.volume,
    }),
    localParticipant(): User | undefined {
      const p = iridium.webRTC.localParticipant()
      return p
    },
    remoteParticipants(): User[] {
      const p = iridium.webRTC.remoteParticipants()
      return p
    },
    height: {
      get(): string {
        return this.callHeight
      },
      set(value) {
        this.$store.commit('ui/setCallHeight', value)
      },
    },
    call(): Call | undefined {
      if (!this.webrtc.activeCall?.callId) {
        return
      }
      return $WebRTC.getCall(this.webrtc.activeCall.callId)
    },
    streams(): any[] {
      if (!this.call) {
        return []
      }
      const muted = Object.entries(iridium.webRTC.state.streamMuted)
      const participantStreams = muted.map(([did, mutedStreams]) => {
        const participant = iridium.users.getUser(did)
        let streams = Object.entries(mutedStreams)
          .filter(([k, v]) => !v && k !== 'headphones')
          .map(([k]) => k)
        streams.unshift('audio')
        streams = Array.from(new Set(streams))
        if (streams.length > 1) {
          streams = streams.filter((s) => s !== 'audio')
        }
        return streams.map((stream) => {
          return { participant, stream }
        })
      })
      return participantStreams.flat()
    },
  },
  watch: {
    streams() {
      this.calculateMediaUserSize()
    },
  },
  mounted() {
    document.addEventListener('fullscreenchange', this.setFullscreenValue)
    document.addEventListener('resize', this.scaleHeight)
    this.resizeObserver = new ResizeObserver(() => {
      this.calculateMediaUserSize()
    })
    const media = this.$refs.media as HTMLElement
    this.resizeObserver.observe(media)
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.setFullscreenValue)
  },
  methods: {
    getBoxDimensionsForLayout(
      params: OptimalBoxDomensionsParams,
      numMaxCols: number,
      numRows: number,
    ): [number, number] {
      const rowGap = params.gap * (numRows - 1)
      const colGap = params.gap * (numMaxCols - 1)
      let boxWidth = (params.containerWidth - colGap) / numMaxCols
      let boxHeight = boxWidth / params.aspectRatio
      const contentHeight = boxHeight * numRows + rowGap
      if (contentHeight > params.containerHeight) {
        boxHeight = (params.containerHeight - rowGap) / numRows
        boxWidth = boxHeight * params.aspectRatio
      }
      return [boxWidth, boxHeight]
    },

    getOptimalBoxDimensions(
      params: OptimalBoxDomensionsParams,
    ): [number, number] {
      let prevWidth = 0
      let prevHeight = 0
      let width = 0
      let height = 0
      for (let numRows = 1; numRows <= params.numBoxes; numRows++) {
        const numMaxCols = Math.ceil(params.numBoxes / numRows)
        prevWidth = width
        prevHeight = height
        ;[width, height] = this.getBoxDimensionsForLayout(
          params,
          numMaxCols,
          numRows,
        )
        if (prevWidth > width) {
          return [prevWidth, prevHeight]
        }
      }
      return [width, height]
    },
    scaleHeight() {
      this.height =
        parseInt(this.height as string, 10) +
        this.windowHeight / window.innerHeight +
        'px'
      this.windowHeight = window.innerHeight
    },
    /**
     * @method volumeControlValueChange DocsTODO
     * @description Changes volume by setting new value using $Sounds.changeLevels and committing new value to setVolume in state
     * @param volume New volume level
     * @example
     */
    volumeControlValueChange(volume: number) {
      this.$Sounds.changeLevels(volume / 100)
      this.$store.commit('audio/setVolume', volume)
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        const media = this.$refs.mediastream as HTMLElement
        media.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    setFullscreenValue() {
      this.isFullscreen = Boolean(document.fullscreenElement)
    },
    calculateMediaUserSize() {
      const media = this.$refs.media as HTMLElement
      this.mediaUserSize = this.getOptimalBoxDimensions({
        containerWidth: media.clientWidth,
        containerHeight: media.clientHeight,
        aspectRatio: 16 / 9,
        numBoxes: this.streams.length,
        gap: 10,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Media.less"></style>
