<template src="./InfiniteScroll.html"></template>

<script lang="ts">
import { PropType } from 'vue'

const defaultOptions = {
  threshold: 0 as number | number[],
  rootMargin: '0px',
  root: null,
}

declare interface BaseComponentData {
  scrollObserver?: IntersectionObserver
}

export default {
  name: 'InfiniteScroll',
  props: {
    offset: {
      type: String,
      default: undefined,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    noMore: {
      type: Boolean,
      default: false,
    },
  },
  data(): BaseComponentData {
    return {}
  },
  mounted() {
    this.scrollObserver = new IntersectionObserver(
      () => {
        if (this.isLoading || this.noMore) {
          return
        }
        this.$emit('loadMore')
      },
      {
        root: (this.$refs.root as Element).parentElement,
        rootMargin: this.offset,
      },
    )

    if (this.$refs.root) {
      this.scrollObserver.observe(this.$refs.root as Element)
    }
  },
  beforeDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect()
    }
  },
}
</script>

<style scoped lang="less" src="./InfiniteScroll.less"></style>
