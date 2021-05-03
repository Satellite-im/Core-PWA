<template src="./Switch.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  model: {
    prop: 'isEnabled',
    event: 'toggle',
  },
  props: {
    isEnabled: Boolean,
    // Allows for background color overrides
    color: {
      type: String,
      required: false,
      default: '#0984e3',
    },
    small: Boolean,
    label: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle', !this.isEnabled)
      this.$emit('change', !this.isEnabled)
    },
  },
})
</script>
<style scoped lang="less" src="./Switch.less"></style>
