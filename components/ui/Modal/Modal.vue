<template src="./Modal.html"></template>

<script>
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
    this.listenToKeyboard()
  },
  beforeDestroy() {
    this.unlistenToKeyboard()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleKeyboard(evt) {
      if (evt.key === 'Escape') {
        this.close()
      }
    },
    listenToKeyboard() {
      document.addEventListener('keyup', this.handleKeyboard)
    },
    unlistenToKeyboard() {
      document.removeEventListener('keyup', this.handleKeyboard)
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
