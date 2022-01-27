<template src="./Switch.html" />
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  model: {
    prop: 'isEnabled',
    event: 'toggle',
  },
  props: {
    /**
     * Should the toggle switch be 'on'
     */
    isEnabled: Boolean,
    /**
     * Allows you to override the switch colors
     */
    color: {
      type: String,
      required: false,
      default: 'null',
    },
    /**
     * Size of the switch
     *
     * @remarks - currently supports 'normal' and 'small'
     */
    small: Boolean,
    /**
     * If provided, a label will be attached to the right of the switch
     */
    label: {
      type: String,
      required: false,
      default: '',
    },

    /**
     * If provided the button would appear as disabled and non interactable
     */
    isLocked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    /**
     * @method toggle DocsTODO
     * @description
     * @example
     */
    toggle() {
      if (!this.isLocked) {
        this.$emit('toggle', !this.isEnabled)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Switch.less"></style>
