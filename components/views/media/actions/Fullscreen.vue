<template>
  <button
    v-tooltip.top="
      isFullscreen ? $t('ui.exit_fullscreen') : $t('ui.fullscreen')
    "
    @click="$emit('toggle')"
  >
    <component
      :is="isFullscreen ? MinimizeIcon : MaximizeIcon"
      size="1.2x"
      :data-cy="isFullscreen ? 'exit-fullscreen' : 'go-fullscreen'"
    />
  </button>
</template>

<script setup lang="ts">
import Vue from 'vue'
import { MaximizeIcon, MinimizeIcon } from 'satellite-lucide-icons'

defineProps<{
  isFullscreen: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<style scoped lang="less"></style>
