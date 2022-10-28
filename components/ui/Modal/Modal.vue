<template>
  <div class="modal-container" :class="{ fullscreen }">
    <div ref="modal" class="modal">
      <slot />
      <InteractablesClose v-if="showCloseButton" @click="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { handleEsc, handleFocusTrap } from '~/components/compositions/events'

interface Props {
  showCloseButton?: boolean
  fullscreen?: boolean
}
interface Emits {
  (e: 'close'): void
}

withDefaults(defineProps<Props>(), {
  showCloseButton: true,
  fullscreen: false,
})

const emit = defineEmits<Emits>()

const modal: Ref<HTMLElement | null> = ref(null)

function close() {
  emit('close')
}

onClickOutside(modal, close)

handleEsc(close)
handleFocusTrap(modal)
</script>

<style scoped lang="less" src="./Modal.less"></style>
