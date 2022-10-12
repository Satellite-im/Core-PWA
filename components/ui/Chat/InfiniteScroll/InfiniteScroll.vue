<template>
  <div ref="root" class="infinite-scroll" />
</template>

<script lang="ts">
import { throttle } from 'lodash'

// the higher the sooner we trigger the 'loadMore' emit
const LOADING_TOLERANCE = 0.25

export default {
  name: 'InfiniteScroll',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    noMore: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    parentElement(): HTMLElement {
      return (this.$refs.root as HTMLElement).parentElement as HTMLElement
    },
    messageLoaderHeight(): number {
      return (
        (
          document.querySelector(
            `[data-id="message-scroll-loader"]`,
          ) as HTMLElement
        )?.offsetHeight ?? 0
      )
    },
  },
  mounted() {
    this.parentElement.addEventListener('wheel', this.scrollHandler)
    this.parentElement.addEventListener('touchmove', this.scrollHandler)
  },
  beforeDestroy() {
    this.parentElement.removeEventListener('wheel', this.scrollHandler)
    this.parentElement.removeEventListener('touchmove', this.scrollHandler)
  },
  methods: {
    scrollHandler: throttle(function (this: any) {
      const contentPart =
        (this.parentElement.scrollHeight - this.messageLoaderHeight) *
        LOADING_TOLERANCE

      if (
        this.isLoading ||
        this.noMore ||
        this.parentElement.scrollTop > this.messageLoaderHeight + contentPart
      ) {
        return
      }

      this.$emit('loadMore')
    }, 100),
  },
}
</script>
