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
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
