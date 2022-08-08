<template src="./InfiniteScroll.html"></template>

<script lang="ts">
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
    threshold(): number {
      return window.innerHeight
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
    scrollHandler() {
      const offset =
        this.parentElement.scrollHeight +
        this.parentElement.scrollTop -
        this.parentElement.getBoundingClientRect().height

      if (this.isLoading || this.noMore || offset > this.threshold) {
        return
      }
      this.$emit('loadMore')
    },
  },
}
</script>

<style scoped lang="less" src="./InfiniteScroll.less"></style>
