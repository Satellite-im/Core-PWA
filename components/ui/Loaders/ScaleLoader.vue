<template>
  <div class="scale-loader">
    <span />
    <span />
    <span />
    <span />
    <span />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ScaleLoader',
})
</script>

<style scoped lang="less">
.scale-loader {
  display: flex;
  span {
    background-color: @white;
    width: 4px;
    height: 20px;
    margin: 2px;
    border-radius: 2px;
    display: inline-block;
    animation: 1s cubic-bezier(0.2, 0.68, 0.18, 1.08) 0.1s infinite normal both
      running scale-loader;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
    &:nth-child(4) {
      animation-delay: 0.4s;
    }
    &:nth-child(5) {
      animation-delay: 0.5s;
    }
  }
}
@keyframes scale-loader {
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.4);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>
