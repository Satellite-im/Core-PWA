<template>
  <component
    :is="as"
    :class="[
      `color-${getColor} font-color-${getFont} font-size-${getSize}`,
      { uppercase: uppercase },
      getWeight,
    ]"
  >
    <slot />
  </component>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Font, Size, TextColor, Weight } from '~/types/typography'

export default Vue.extend({
  props: {
    as: {
      type: String as PropType<keyof HTMLElementTagNameMap>,
      default: 'div',
    },
    color: {
      type: String as PropType<TextColor>,
      default: '',
    },
    font: {
      type: String as PropType<Font>,
      default: '',
    },
    size: {
      type: String as PropType<Size>,
      default: '',
    },
    weight: {
      type: String as PropType<Weight>,
      default: '',
    },
    uppercase: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // These reduce the number of props you need to pass in common situations, while still allowing the ability to override with props as needed
    getColor(): string {
      if (this.color) {
        return this.color
      }
      if (this.as.match('h[1-3]|label')) {
        return 'light'
      }
      return 'body'
    },
    getFont(): string {
      if (this.font) {
        return this.font
      }
      if (this.as.match('h[1-3]')) {
        return 'heading'
      }
      return 'body'
    },
    getSize(): string {
      if (this.size) {
        return this.size
      }
      const map = new Map()
      map.set('h1', '2xl').set('h2', 'xl').set('h3', 'lg').set('label', 'sm')
      return map.get(this.as) || 'md'
    },
    getWeight(): string {
      if (this.weight) {
        return this.weight
      }
      if (this.as.match('h[1-3]')) {
        return 'bold'
      }
      return ''
    },
  },
})
</script>
<style scoped lang="less">
.bold {
  font-weight: 700;
}

h1 {
  margin-bottom: 1rem;
}
.uppercase {
  text-transform: uppercase;
}
</style>
