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
    containerClass: {
      type: String,
      default: '',
      required: false,
    },
    scrollTopOnChange: {
      type: [String, Boolean, Number, Array],
      default: '',
      required: false,
    },
  },
  watch: {
    scrollTopOnChange: {
      handler(val) {
        if (!this.$refs.simplescrollbar) {
          return
        }
        this.$refs.simplescrollbar.scrollTop = 0
      },
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./SimpleScroll.less"></style>
