<template>
  <span class="tag">
    {{ text }}
  </span>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    // eslint-disable-next-line vue/require-default-prop
    text: {
      type: String,
      default: '',
    },
  },
})
</script>
<style scoped lang="less">
.tag {
  background: @dark-gray;
  color: @bright-text;
}
</style>
