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
  data() {
    return { scrolling: false, timeout: null }
  },
  methods: {
    onScroll: throttle(function () {
      if (this.$props.scrollShow !== 'always') {
        if (this.scrolling) {
          if (this.timeout) {
            clearTimeout(this.timeout)
          }

          this.timeout = setTimeout(() => {
            this.scrolling = false
          }, 1000)
        }

        this.scrolling = true
      }
    }, 500),
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./SimpleScroll.less"></style>
