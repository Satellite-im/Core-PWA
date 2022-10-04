<template src="./AudioPlayer.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { DownloadIcon } from 'satellite-lucide-icons'

import { AudioData } from './types'

export default Vue.extend({
  components: {
    DownloadIcon,
  },
  props: {
    data: {
      type: Object as PropType<AudioData> | undefined,
      default: () => {},
    },
  },
})
</script>
<style lang="less" src="./AudioPlayer.less" scoped></style>
