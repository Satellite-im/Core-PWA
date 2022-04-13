<template src="./SimpleScroll.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'
import { throttle } from 'lodash'

type ScrollMode = 'vertical' | 'horizontal'
type ScrollShow = 'always' | 'scroll'

export default Vue.extend({
  name: 'ScrollBar',
  props: {
    scrollMode: {
      type: String as PropType<ScrollMode>,
      default: 'vertical',
      required: false,
    },
    scrollShow: {
      type: String as PropType<ScrollShow>,
      default: 'scroll',
      required: false,
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./SimpleScroll.less"></style>
