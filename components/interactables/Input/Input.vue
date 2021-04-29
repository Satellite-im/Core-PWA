<template>
  <input
    v-model="internalText"
    :class="`input is-${size} is-${type}`"
    :readonly="readonly"
    :type="inputKind"
    :placeholder="placeholder"
    @input="update"
  />
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { InputTypes, InputStyle, InputSize } from './types.d'

export default Vue.extend({
  model: {
    prop: 'text',
    event: 'update',
  },
  props: {
    // Default text can be included here
    text: {
      type: String,
      default: '',
    },
    // Used for display only inputs
    readonly: {
      type: Boolean,
      default: false,
    },
    // Abstraction of native "type"
    inputKind: {
      type: String as PropType<InputTypes>,
      default: 'text',
    },
    // Placeholder text for blank inputs
    placeholder: {
      type: String,
      default: 'Placeholder...',
    },
    // Size of the input, reference InputSize types or Bulma.io
    size: {
      type: String as PropType<InputSize>,
      default: 'normal',
    },
    // Style of the input, reference InputStyle types or Bulma.io
    type: {
      type: String as PropType<InputStyle>,
      default: 'normal',
    },
  },
  data() {
    return {
      internalText: this.text ? this.text : '',
    }
  },
  methods: {
    update() {
      this.$emit('update', this.internalText)
    },
  },
})
</script>
<style scoped lang="less"></style>
