<template src="./AudioPlayer.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { AudioData } from './types'

export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<AudioData> | undefined,
      default: () => {},
    },
  },
})
</script>
<style lang="less" src="./AudioPlayer.less"></style>
