<template src="./Select.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { SelectSize, SelectStyle } from './types.d'
import { SelectOption } from '~/types/ui/inputs'

export default Vue.extend({
  model: {
    prop: 'selected',
    event: 'change',
  },
  props: {
    fullWidth: Boolean,
    selected: {
      type: [String, Number, Boolean],
      default: false,
    },
    options: {
      type: Array as PropType<Array<SelectOption>>,
      default: () => [
        {
          value: 0,
          text: 'No Options Provided',
        },
      ],
    },
    // Determines the size of the button
    // e.g. small, regular, medium, large..
    size: {
      type: String as PropType<SelectSize>,
      default: 'normal',
    },
    // Determines the type of the button
    // e.g. primary, default, dark..
    type: {
      type: String as PropType<SelectStyle>,
      default: 'primary',
    },
  },
  methods: {
    change() {
      this.$emit('change', this.selected)
    },
  },
})
</script>
<style scoped lang="less" src="./Select.less"></style>
