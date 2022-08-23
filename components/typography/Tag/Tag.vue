<template>
  <TypographyText
    class="tag"
    :class="{ inverted: inverted }"
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
  },
})
</script>
<style lang="less">
.tag {
  user-select: none;
  background-color: @flair-color;
  background: @flair-gradient;
  box-shadow: @flair-glow;
  padding: 4px 8px;
  border-radius: @corner-rounding;

  &.inverted {
    background: @semitransparent-dark-gradient;
    box-shadow: none;
  }
}
</style>
