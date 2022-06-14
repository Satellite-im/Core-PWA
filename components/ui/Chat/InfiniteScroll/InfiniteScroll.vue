<template src="./InfiniteScroll.html" />

<script lang="ts">
import { PropType } from 'vue'

const defaultOptions = {
  threshold: 0 as number | number[],
  rootMargin: '0px',
  root: null,
}

declare interface BaseComponentData {
  scrollObserver: IntersectionObserver | null
  isIntersecting: boolean
  isComplete: boolean
  debounceTimeout: ReturnType<typeof setTimeout> | null
}

export default {
  name: 'InfiniteScroll',
  props: {
    options: {
      type: Object as PropType<typeof defaultOptions>,
      default: () => defaultOptions,
      required: false,
    },
  },
  emits: ['intersect'],
  data(): BaseComponentData {
    return {
      scrollObserver: null,
      isIntersecting: false,
      isComplete: false,
      debounceTimeout: null,
    }
  },
  mounted() {
    this.scrollObserver = new IntersectionObserver(([entry]) => {
      clearTimeout(this.debounceTimeout)
      if (entry && entry.isIntersecting && this.$refs.root) {
        this.isIntersecting = true
        this.scrollObserver.unobserve(this.$refs.root)
        this.$emit('intersect', {
          loaded: () => {
            this.debounceTimeout = setTimeout(() => {
              this.scrollObserver.observe(this.$refs.root)
            }, 100)
          },
          complete: () => {
            this.scrollObserver?.disconnect()
            this.isIntersecting = false
            this.isComplete = true
          },
        })
      }
    }, this.options)

    if (this.$refs.root) {
      this.scrollObserver.observe(this.$refs.root)
    }
  },
  beforeDestroy() {
    if (this.scrollObserver) this.scrollObserver.disconnect()
  },
}
</script>
