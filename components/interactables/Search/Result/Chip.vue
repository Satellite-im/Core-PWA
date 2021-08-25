<template>
  <div class="chip-item">
    {{ text }}
    <font-awesome-icon :icon="['far', 'close']" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped lang="less">
.chip-item {
  padding: 4px 8px;
  border-radius: 24px;
  background-color: @primary-color;
  color: white;
  .fa-close {
    margin-left: 12px;
  }
}
</style>
