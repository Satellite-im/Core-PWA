<template>
  <div
    class="spacer"
    :style="{
      height: `${height}px`,
    }"
  />
</template>

<script setup lang="ts">
defineProps({
  /**
   * @description Height of spacer (in pixels)
   */
  height: {
    type: Number,
    default: 40,
  },
})
</script>

<style scoped lang="less">
.spacer {
  &:extend(.full-width);
  display: inline-flex;
}
</style>
