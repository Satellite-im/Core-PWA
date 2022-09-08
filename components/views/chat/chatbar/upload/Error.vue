<template>
  <div class="file-error">
    <TypographyText color="danger">
      {{ $t('errors.chat.drop_file_count') }}
    </TypographyText>
    <x-icon
      size="1x"
      class="has-text-danger"
      @click="$store.commit('chat/setCountError', false)"
    />
  </div>
</template>

<script setup lang="ts">
import Vue from 'vue'
import { XIcon } from 'satellite-lucide-icons'
</script>

<style scoped lang="less">
.file-error {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @normal-spacing;
  &:extend(.background-semitransparent-light);
  border-radius: @corner-rounding @corner-rounding 0 0;

  svg {
    cursor: pointer;
  }
}
</style>
