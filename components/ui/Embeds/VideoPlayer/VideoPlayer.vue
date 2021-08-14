<template src="./VideoPlayer.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { VideoData } from './types'

export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<VideoData> | undefined,
      default: () => {},
    },
  },
})
</script>
<style lang="less" src="./VideoPlayer.less"></style>
