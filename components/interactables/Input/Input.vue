<template src="./Input.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DeleteIcon } from 'satellite-lucide-icons'
import { InputType, InputColor, InputSize } from './types'

export default Vue.extend({
  components: {
    DeleteIcon,
  },
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
    minLength: {
      type: Number,
      default: 0,
    },
    maxLength: {
      type: Number,
      default: 256,
    },
    showClear: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      value: this.text ?? '',
    }
  },
  computed: {
    isEmpty() {
      return !this.value.length
    },
  },
  watch: {
    text(value) {
      this.value = value
    },
  },
  mounted() {
    if (this.autofocus) {
      this.$nextTick(() => (this.$refs?.input as HTMLElement).focus())
    }
  },
  methods: {
    handleSubmit(event: InputEvent) {
      if (this.disabled || this.loading || this.error || this.invalid) {
        return
      }
      this.$emit('submit', event)
    },
    handleInput(event: InputEvent) {
      if (!event.target) {
        return
      }
      const target = event.target as HTMLInputElement
      this.value = target.value
      this.$emit('change', target.value)
    },
    clearInput() {
      const input = this.$refs.input as HTMLInputElement
      this.value = ''
      input.value = ''
      input.focus()
    },
  },
})
</script>

<style scoped lang="less" src="./Input.less"></style>
