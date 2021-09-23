<template src="./InputGroup.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { InputTypes, InputStyle, InputSize } from './types.d'
import { Icon } from '~/types/ui/icons'

export default Vue.extend({
  model: {
    prop: 'text',
    event: 'update',
  },
  props: {
    /**
     * Default text can be included here
     */
    text: {
      type: [String, Number],
      default: '',
    },
    /**
     * Used for display only inputs
     */
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Abstraction of native "type"
     */
    inputKind: {
      type: String as PropType<InputTypes>,
      required: false,
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
      required: false,
      default: 'normal',
    },
    /**
     * Style of the input, reference InputStyle types or Bulma.io
     */
    type: {
      type: String as PropType<InputStyle>,
      required: false,
      default: 'normal',
    },
    /**
     * Disbales the attached button
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Attached button action
     */
    action: {
      type: Function,
      default: () => {},
    },
    /**
     * Optional button text
     */
    buttonText: {
      type: String,
      default: '',
    },
    /**
     * Supported fontawesome icon
     */
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: Object as PropType<Icon>,
      required: false,
    },
    /**
     * Should the button be in the loading state
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * Add a label to the top of the input
     */
    labelText: {
      type: String,
      required: false,
      default: '',
    },
    /**
     * Content to be copied when the input group button is clicked
     */
    copyContent: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      internalText: this.text ? this.text : '',
    }
  },
  methods: {
    /**
     * @method update
     * @description Emits the update event with updated internalText string
     */
    update() {
      this.$emit('update', this.$data.internalText)
    },
  },
})
</script>
<style scoped lang="less" src="./InputGroup.less"></style>
