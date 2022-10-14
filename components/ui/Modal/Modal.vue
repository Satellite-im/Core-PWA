<template src="./Modal.html"></template>

<script lang="ts">
import Vue, { ref, Ref } from 'vue'
import { handleEsc, handleFocusTrap } from '~/components/compositions/events'

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
  setup(props, { emit }) {
    const modal: Ref<HTMLElement | null> = ref(null)

    function close() {
      emit('close')
    }

    handleEsc(close)
    handleFocusTrap(modal)

    return {
      modal,
      close,
    }
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
