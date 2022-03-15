<template src="./Input.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { DeleteIcon } from 'satellite-lucide-icons'

import { InputTypes, InputStyle, InputSize } from './types.d'

export default Vue.extend({
  components: {
    DeleteIcon,
  },
  model: {
    prop: 'text',
    event: 'update',
  },
  props: {
    /**
     * If enabled, the button will take up 100% of the parent container
     */
    fullWidth: Boolean,
    /**
     * If enabled, delete text icon will appear
     */
    deleteIcon: Boolean,
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
      default: false,
    },
    /**
     * Used for set disabled status
     */
    disabled: {
      type: Boolean,
      required: false,
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
    /**
     * Add a label to the top of the input
     */
    labelText: {
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
      this.$emit('update', this.internalText)
    },
    /**
     * @method clearSearch
     * @description Sets internalText in data to an empty string
     */
    clearSearch() {
      this.internalText = ''
    },
  },
})
</script>
<style scoped lang="less" src="./Input.less"></style>
