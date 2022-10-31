<template>
  <button data-cy="close-button" @click="$emit('click', $event)">
    <div class="hidden">
      {{ $t('ui.close') }}
    </div>
    <x-icon size="1.6x" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { XIcon } from 'satellite-lucide-icons'
</script>

<style scoped lang="less">
button {
  position: absolute;
  right: 0;
  top: 0;
  font-size: @font-size-xs;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: @dark;
  filter: drop-shadow(0px 5px 8px @black);
}
</style>
