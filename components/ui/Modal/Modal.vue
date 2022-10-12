<template src="./Modal.html"></template>

<script lang="ts">
import Vue from 'vue'
import { createFocusTrap, FocusTrap, Options } from 'focus-trap'

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
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    trap: null as FocusTrap | null,
  }),
  beforeDestroy() {
    this.removeEventListener()
    this.trap?.deactivate()
  },
  mounted() {
    const modal = this.$refs.modal as HTMLElement
    const options: Options = {
      allowOutsideClick: true,
      escapeDeactivates: false,
    }

    this.$nextTick(() => {
      this.trap = createFocusTrap(modal, options)
      this.trap.activate()
    })

    this.addEventListener()
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
