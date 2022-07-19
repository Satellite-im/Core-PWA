<template src="./InputGroup.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { toArray } from 'lodash'
import { InputTypes, InputStyle, InputSize } from './types.d'

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
    /**
     * autofocus the input on mount
     */
    autofocus: {
      type: Boolean,
      default: false,
    },
    /**
     * Abstraction of native "type"
     */
    inputKind: {
      type: String as PropType<InputTypes>,
      default: 'text',
    },
    /**
     * Placeholder text for blank inputs
     */
    placeholder: {
      type: String,
      default: 'Placeholder...',
    },
    /**
     * Size of the input, reference InputSize types or Bulma.io
     */
    size: {
      type: String as PropType<InputSize>,
      default: 'normal',
    },
    /**
     * Style of the input, reference InputStyle types or Bulma.io
     */
    type: {
      type: String as PropType<InputStyle>,
      default: 'normal',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Function,
      required: true,
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
  computed: {
    textLength(): string {
      /* toArray(): https://lodash.com/docs/4.17.15#toArray */
      return `${toArray(this.text).length}/${this.maxLength}`
    },
  },
  mounted() {
    if (this.autofocus) {
      this.$nextTick(() => (this.$refs?.input as HTMLElement).focus())
    }
  },
})
</script>
<style scoped lang="less" src="./InputGroup.less"></style>
