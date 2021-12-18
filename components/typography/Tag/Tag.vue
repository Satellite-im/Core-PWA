<template>
  <span :class="inverted ? 'tag tag-inverted' : 'tag'">
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
    inverted: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style lang="less">
.tag {
  &:extend(.background-primary-gradient);
  &:extend(.glow-primary);
  color: @bright-text !important;
}
.tag-inverted {
  &:extend(.font-bright);
  background: @light-gray !important;
  box-shadow: none;
}
</style>
