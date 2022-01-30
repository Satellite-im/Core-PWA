<template>
  <div class="spacer" :style="`height: ${height}px`" />
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    /**
     * Height of the spacer (in pixels)
     */
    height: {
      type: Number,
      default: 40,
    },
  },
})
</script>
<style scoped lang="less">
.spacer {
  &:extend(.full-width);
  display: inline-flex;
}
</style>
