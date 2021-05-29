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
    /**
     * If provided the select will cover 100% of the parent
     */
    fullWidth: Boolean,
    /**
     * The default selected value out of the options provided
     */
    selected: {
      type: [String, Number, Boolean],
      default: false,
    },
    /**
     * List of options for the select box
     */
    options: {
      type: Array as PropType<Array<SelectOption>>,
      default: () => [
        {
          value: 0,
          text: 'No Options Provided',
        },
      ],
    },
    /**
     * Determines the size of the select
     *
     * @remarks - Common values are small, regular, medium, large
     */
    size: {
      type: String as PropType<SelectSize>,
      default: 'normal',
    },
    /**
     * Determines the style type of the select
     *
     * @remarks - Common values are primary, dark, danger, etc.
     */
    type: {
      type: String as PropType<SelectStyle>,
      default: 'primary',
    },
  },
  data() {
    return {
      selectedValue: this.selected,
    }
  },
  watch: {
    selected(newValue, oldValue) {
      // When the component is first created, if the user doesn't have a default value for the select, we set it here
      if (!oldValue) {
        this.$data.selectedValue = newValue
      }
    },
  },
  methods: {
    change() {
      this.$emit('change', this.selectedValue)
    },
  },
})
</script>
<style scoped lang="less" src="./Select.less"></style>
