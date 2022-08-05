<template>
  <component
    :is="as"
    :class="[
      `color-${color} font-${font}`,
      { uppercase: uppercase },
      { small: small },
    ]"
    :style="`font-weight: ${weight}`"
  >
    <slot />
  </component>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'

type Color = 'body' | 'light' | 'dark' | 'flair'
type Font = 'heading' | 'body'

export default Vue.extend({
  props: {
    as: {
      type: String as PropType<keyof HTMLElementTagNameMap>,
      default: 'div',
    },
    color: {
      type: String as PropType<Color>,
      default: 'body',
    },
    font: {
      type: String as PropType<Font>,
      default: 'body',
    },
    weight: {
      type: Number,
      default: 400,
    },
    uppercase: {
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
<style scoped lang="less">
@heading-font: 'SpaceMono', monospace;
@body-font: 'Poppins';

.color {
  &-body {
    color: @body;
  }
  &-light {
    color: @light;
  }
  &-dark {
    color: @dark;
  }
  &-flair {
    color: @flair-color;
  }
}
.font {
  &-heading {
    font-family: @heading-font;
  }
  &-body {
    font-family: @body-font;
  }
}

h1 {
  font-size: 1.5rem;
}
h2 {
  font-size: 1rem;
}
.uppercase {
  text-transform: uppercase;
}
.small {
  font-size: 0.875rem;
}
</style>
