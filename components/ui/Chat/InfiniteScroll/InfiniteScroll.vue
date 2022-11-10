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

const Scroller = Vue.extend({
  name: 'InfiniteScroll',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    noTrailing: {
      type: Boolean,
      default: false,
    },
    noLeading: {
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
    trailingMessageLoader(): HTMLElement | null {
      return this.noTrailing
        ? null
        : (document.querySelector(
            `[data-id="trailing-message-scroll-loader"]`,
          ) as HTMLElement)
    },
    leadingMessageLoader(): HTMLElement | null {
      return this.noLeading
        ? null
        : (document.querySelector(
            `[data-id="leading-message-scroll-loader"]`,
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

      this.emit()
    }, 100),
    onScrollDebounce: debounce(function (this: any) {
      const container = this.$refs.container as HTMLElement | null
      if (!container) return

      this.isLockedToBottom =
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 1 && this.noLeading

      if (this.isLockedToBottom) {
        this.$emit('bottomReached')
      }
      // when reaching the top of the loader bring the scroll to the beginning of the loader
      if (
        this.trailingMessageLoader &&
        container.scrollTop === 0 &&
        !this.isScrollbarDragged
      ) {
        this.trailingMessageLoader.scrollIntoView(false)
      }
    }, 100),
    emit() {
      const container = this.$refs.container as HTMLElement | null
      if (!container) return

      const commonCond = !this.isLoading && !this.isScrollbarDragged
      if (this.leadingMessageLoader) {
        const distanceFromBottom =
          container.scrollHeight - container.clientHeight - container.scrollTop

        if (
          commonCond &&
          !this.noLeading &&
          distanceFromBottom <=
            this.leadingMessageLoader.offsetHeight + container.clientHeight
        ) {
          this.$emit('loadLess')
        }
      }

      if (
        this.trailingMessageLoader &&
        commonCond &&
        !this.noTrailing &&
        container.scrollTop <=
          this.trailingMessageLoader.offsetHeight + container.clientHeight
      ) {
        this.$emit('loadMore')
      }
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
        this.emit()
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
