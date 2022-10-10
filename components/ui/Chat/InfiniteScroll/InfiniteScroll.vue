<template>
  <div
    ref="container"
    class="scroller"
    @scroll="
      onScrollThrottle()
      onScrollDebounce()
    "
    @mouseup="onMouseUp"
    @mousedown="onMouseDown"
  >
    <slot :is-scrolling="isScrolling" />
  </div>
</template>

<script lang="ts">
import { debounce, throttle } from 'lodash'
import Vue from 'vue'

// the higher the sooner we trigger the 'loadMore' emit
const LOADING_TOLERANCE = 0.25

const Scroller = Vue.extend({
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
  data: () => ({
    isLockedToBottom: true,
    isScrolling: false,
    isScrollbarDragged: false,
    resizeContainerObserver: null as ResizeObserver | null,
    timeoutScrolling: undefined as undefined | NodeJS.Timer,
  }),
  computed: {
    messageLoader(): HTMLElement | null {
      return this.noMore
        ? null
        : (document.querySelector(
            `[data-id="message-scroll-loader"]`,
          ) as HTMLElement)
    },
  },
  mounted() {
    const container = this.$refs.container as HTMLElement | undefined
    if (!container) {
      return
    }

    this.resizeContainerObserver = new ResizeObserver(() => {
      if (this.isLockedToBottom) {
        this.scrollToBottom()
      }
    })
    this.resizeContainerObserver.observe(container)
  },
  beforeDestroy() {
    this.resizeContainerObserver?.disconnect()
  },
  methods: {
    onScrollThrottle: throttle(function (this: any) {
      this.isScrolling = true
      clearTimeout(this.timeoutScrolling)
      this.timeoutScrolling = setTimeout(() => {
        this.isScrolling = false
      }, 150)

      this.emitMore()
    }, 100),
    onScrollDebounce: debounce(function (this: any) {
      const container = this.$refs.container as HTMLElement | null
      if (!container) return

      this.isLockedToBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 1

      // when reaching the top of the loader bring the scroll to the beginning of the loader
      if (
        this.messageLoader &&
        container.scrollTop === 0 &&
        !this.isScrollbarDragged
      ) {
        this.messageLoader.scrollIntoView(false)
      }
    }, 100),
    emitMore() {
      const container = this.$refs.container as HTMLElement | null
      if (!container || !this.messageLoader) return

      const contentPart =
        (container.scrollHeight - this.messageLoader.offsetHeight) *
        LOADING_TOLERANCE

      if (
        this.isLoading ||
        this.noMore ||
        this.isScrollbarDragged ||
        container.scrollTop > this.messageLoader.offsetHeight + contentPart
      ) {
        return
      }

      this.$emit('loadMore')
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.container as HTMLElement | null
        if (!container) return
        container.scrollTop = container.scrollHeight
      })
    },
    onMouseUp() {
      const container = this.$refs.container as HTMLElement | null
      if (!container) return

      if (this.isScrollbarDragged) {
        this.isScrollbarDragged = false
        this.emitMore()
      }
    },
    onMouseDown(e: MouseEvent) {
      const container = this.$refs.container as HTMLElement | null
      if (!container) return
      this.isScrollbarDragged =
        e.target === container && e.offsetX > container.clientWidth
    },
  },
})

export type ScrollerRef = InstanceType<typeof Scroller>
export default Scroller
</script>

<style scoped lang="less">
.scroller {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
