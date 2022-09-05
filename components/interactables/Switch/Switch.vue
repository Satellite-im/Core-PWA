<template src="./Switch.html"></template>
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
  computed: {
    isFocused() {
      return this.$refs.switch === document.activeElement
    },
    container(): HTMLElement {
      return this.$refs.container as HTMLElement
    },
  },
  mounted() {
    this.addKeydownListener()
  },
  beforeDestroy() {
    this.removeKeydownListener()
  },
  methods: {
    addKeydownListener() {
      this.container.addEventListener('keydown', this.handleKeydown)
    },
    removeKeydownListener() {
      this.container.removeEventListener('keydown', this.handleKeydown)
    },
    handleKeydown(event: KeyboardEvent) {
      if (this.isFocused && event.key === 'Enter') {
        this.$emit('toggle', !this.isEnabled)
      }
    },
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
