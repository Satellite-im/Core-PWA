<template>
  <div class="horizontal-rule" />
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
<style scoped lang="less">
.horizontal-rule {
  height: 1px;
  background: @splash-radial;
  margin: @normal-spacing 0;
}
.theme-moonlessNight {
  .horizontal-rule {
    background: @lighter-splash-radial;
  }
}
</style>
