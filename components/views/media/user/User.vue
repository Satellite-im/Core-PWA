<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  VideoIcon,
  VideoOffIcon,
  MicIcon,
  MicOffIcon,
} from 'satellite-lucide-icons'
import { User } from '~/types/ui/user'

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
      default: () => {},
    },
    calling: {
      type: Boolean,
      default: false,
    },
    videoStream: {
      type: MediaStream,
      default: undefined,
    },
    audioStream: {
      type: MediaStream,
      default: undefined,
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
  watch: {
    videoStream(value) {
      if (value) {
        this.$nextTick(() => {
          this.playVideo()
        })
      }
    },
  },
  mounted() {
    if (this.videoStream) {
      this.playVideo()
    }
  },
  methods: {
    playVideo() {
      const video = document.querySelector(
        `#${this.isLocal ? 'local' : 'remote'}-video`,
      ) as HTMLVideoElement

      video?.play()
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
