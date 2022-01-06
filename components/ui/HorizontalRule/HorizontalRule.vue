<template>
  <div class="horizontal-rule">
    <hr />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
<style scoped lang="less">
hr {
  height: 0px;
  border: none;
  border-bottom: transparents;
}
div {
  height: 1px;
  background: @splash-radial;
  margin: @normal-spacing 0;
}
</style>
