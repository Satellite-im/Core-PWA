<template>
  <div class="loading-bar">
    <div class="bar" :style="`height: ${height}px`"></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    height: {
      type: Number,
      default: 6,
    },
  },
})
</script>
<style scoped lang="less">
.loading-bar {
  display: inline-flex;
  width: 100%;

  .bar {
    animation: loading 2s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
    float: left;
    width: 5px;
    height: 6px;
    border-radius: 2px;
  }
}

@keyframes loading {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(80px, 0);
    width: 25px;
  }
}
</style>
