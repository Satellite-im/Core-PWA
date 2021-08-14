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
svg {
  float: right;
  font-size: @mini-text-size;
  margin-top: 0.5rem;
  color: @text-muted;
  cursor: pointer;
}
</style>
