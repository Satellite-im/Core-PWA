<template>
  <TypographyText
    class="tag"
    :class="{ inverted, small }"
    color="white"
    size="xs"
  >
    <slot>{{ text }}</slot>
  </TypographyText>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '',
    },
    inverted: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style lang="less" scoped>
.tag {
  user-select: none;
  background-color: @flair-color;
  background: @flair-gradient;
  box-shadow: @flair-glow;
  padding: 4px 8px;
  border-radius: @corner-rounding;
  min-width: 18px;

  &.inverted {
    background: @semitransparent-dark-gradient;
    box-shadow: none;
  }

  &.small {
    padding: 2px 6px;
  }
}
</style>
