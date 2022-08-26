<template src="./Modal.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.addEventListener()
  },
  beforeDestroy() {
    this.removeEventListener()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        this.close()
      }
    },
    addEventListener() {
      document.addEventListener('keydown', this.handleKeydown)
    },
    removeEventListener() {
      document.removeEventListener('keydown', this.handleKeydown)
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
