<template src="./Switch.html"></template>
<script lang="ts">
import Vue from 'vue'
import whatInput from 'what-input'

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'toggle',
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isFocused: false,
  }),
  methods: {
    /**
     * @method toggle DocsTODO
     * @description
     * @example
     */
    toggle() {
      if (!this.isLocked) {
        this.$emit('toggle', !this.value)
      }
    },
    handleFocus() {
      if (whatInput.ask() === 'keyboard') {
        this.isFocused = true
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Switch.less"></style>
