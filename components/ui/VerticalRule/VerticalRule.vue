<template>
  <div class="vertical-container">
    <div class="vertical-rule" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
<style scoped lang="less">
.vertical-rule {
  width: 1px;
  height: 40px;
  background: @splash-radial;
}
.vertical-container {
  padding: 0 @normal-spacing;
}
</style>
