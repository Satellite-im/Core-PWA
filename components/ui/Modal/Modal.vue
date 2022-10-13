<template src="./Modal.html"></template>

<script lang="ts">
import Vue, { nextTick, onMounted, onUnmounted, ref, Ref } from 'vue'
import { createFocusTrap, FocusTrap, Options } from 'focus-trap'
import { handleEsc } from '~/components/compositions/events'

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
    const trap: Ref<FocusTrap | null> = ref(null)
    const modal: Ref<HTMLElement | null> = ref(null)

    function close() {
      emit('close')
    }

    onMounted(() => {
      const options: Options = {
        allowOutsideClick: true,
        escapeDeactivates: false,
      }

      nextTick(() => {
        if (!modal.value) {
          return
        }
        trap.value = createFocusTrap(modal.value, options)
        trap.value.activate()
      })
    })
    onUnmounted(() => trap.value?.deactivate())
    handleEsc(close)

    return {
      modal,
      close,
    }
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
