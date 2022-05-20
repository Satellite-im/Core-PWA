<template src="./InfiniteScroll.html" />

<script>
const defaultOptions = {
  threshold: 0,
  rootMargin: '0px',
  root: null,
}

export default {
  name: 'InfiniteScroll',
  props: {
    options: {
      type: Object,
      default: () => defaultOptions,
      required: false,
    },
  },
  emits: ['intersect'],
  data() {
    return {
      scrollObserver: null,
      isIntersecting: false,
      isComplete: false,
    }
  },
  mounted() {
    this.scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting && this.$refs.root) {
        this.isIntersecting = true
        this.scrollObserver.unobserve(this.$refs.root)
        this.$emit('intersect', {
          loaded: () => {
            this.isIntersecting = false
            this.scrollObserver.observe(this.$refs.root)
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

<style scoped lang="less" src="./InfiniteScroll.less"></style>
