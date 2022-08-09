<template src="./InputGroup.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { InputType, InputColor, InputSize } from './types'

export default Vue.extend({
  model: {
    prop: 'text',
    event: 'change',
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<InputType>,
      default: 'text',
    },
    size: {
      type: String as PropType<InputSize>,
      default: 'md',
    },
    color: {
      type: String as PropType<InputColor>,
      default: 'primary',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    showLimit: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 256,
    },
  },
  mounted() {
    if (this.autofocus) {
      this.$nextTick(() => (this.$refs?.input as HTMLElement).focus())
    }
  },
  methods: {
    handleSubmit(event: InputEvent) {
      if (this.disabled || this.loading) {
        return
      }
      this.$emit('submit', event)
    },
  },
})
</script>

<style scoped lang="less" src="./InputGroup.less"></style>
