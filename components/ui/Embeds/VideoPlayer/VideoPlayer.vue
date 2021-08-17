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
<style scoped lang="less">
.is-text {
  font-size: @micro-text-size;
  padding: 0;
  line-height: 0.8;
  font-family: @primary-font;
  color: @text-muted;
  display: inline-block;
  text-align: left;
}
.download {
  float: right;
  font-family: @primary-font;
  font-size: @mini-text-size;
  margin-top: 0.25rem;
  color: @text-muted;
  cursor: pointer;
  &:hover {
    color: @bright-text;
  }
}
</style>
