<template>
  <div class="horizontal-container">
    <div class="horizontal-rule" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
<style scoped lang="less">
.horizontal-rule {
  height: 1px;
  background: @splash-radial;
}
.horizontal-container {
  padding: @normal-spacing 0;
}
.moonless-night {
  .horizontal-rule {
    background: @lighter-splash-radial;
  }
}
</style>
