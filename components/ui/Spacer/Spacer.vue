<template>
  <div class="spacer" :style="`height: ${height}px`"></div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    height: {
      type: Number,
      default: 40,
    },
  },
})
</script>
<style scoped lang="less">
.spacer {
  width: 100%;
  display: inline-flex;
}
</style>
