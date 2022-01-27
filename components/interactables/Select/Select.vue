<template src="./Select.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import Vue, { PropType } from 'vue'
import { SelectSize, SelectStyle } from './types.d'
import { SelectOption } from '~/types/ui/inputs'

export default Vue.extend({
  model: {
    prop: 'selected',
    event: 'change',
  },
  props: {
    colorSupport: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
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
      selectedValue: this.placeholder.length ? null : this.selected,
      open: false,
      up: false,
    }
  },
  watch: {
    /**
     * @method selected DocsTODO
     * @description When the component is first created, if the user doesn't have a default value for the select, we set it here
     * @param newValue
     * @param oldValue
     * @example
     */
    selected(newValue, oldValue) {
      if (oldValue !== newValue) {
        this.$data.selectedValue = newValue
      }
    },
  },
  methods: {
    /**
     * @method change DocsTODO
     * @description
     * @param option
     * @example
     */
    change(option: any) {
      if (option.disabled) return
      this.selectedValue = option.value
      this.$emit('change', this.selectedValue)
      this.open = false
    },
    /**
     * @method toggleOpen DocsTODO
     * @description
     * @param
     * @example
     */
    toggleOpen() {
      if (this.disabled) {
        this.open = false
        return
      }
      const bodyRect = document.body.getBoundingClientRect()
      const elementRect = this.$el.getBoundingClientRect()
      this.up = elementRect.top > bodyRect.bottom / 2
      this.open = !this.open
    },
    /**
     * @method getSelectLabel DocsTODO
     * @description
     * @param
     * @returns
     * @example
     */
    getSelectLabel() {
      if (this.selectedValue) {
        const item: any = (this.options as Array<SelectOption>).find(
          (opt: SelectOption) => opt.value === this.selectedValue,
        )
        if (item) return item.text
      }
      return this.placeholder
    },
  },
})
</script>
<style scoped lang="less" src="./Select.less"></style>
