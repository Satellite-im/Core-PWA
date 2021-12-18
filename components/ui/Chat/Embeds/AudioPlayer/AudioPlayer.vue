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
<style lang="less" src="./AudioPlayer.less"></style>
<style scoped lang="less">
.is-text {
  font-size: @micro-text-size;
  padding: 0;
  line-height: 0.8;
  font-family: @primary-font;
  &:extend(.font-muted);
  display: inline-block;
  text-align: left;
}
.download {
  float: right;
  font-family: @primary-font;
  font-size: @mini-text-size;
  margin-top: 0.25rem;
  &:extend(.font-muted);
  cursor: pointer;

  &:hover {
    &:extend(.font-bright);
  }
}
</style>
