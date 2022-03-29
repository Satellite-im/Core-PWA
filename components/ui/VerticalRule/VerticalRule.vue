<template>
  <div class="vertical-rule">
    <div />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
<style scoped lang="less">
div {
  width: 1px;
  height: 40px;
  background: @splash-radial;
}
div.vertical-rule {
  margin: 0 @normal-spacing;
}
</style>
