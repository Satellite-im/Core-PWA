<template src="./ButtonGroup.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: [String, Boolean, Number],
      required: false,
      default: null,
    },
    values: {
      type: Array,
      required: false,
      default: null,
    },
    /**
     * Callable function when button is clicked
     *
     * @remarks
     * This should usually be a store mutation or UI change.
     */
    action: {
      type: Function,
      required: false,
      default: null,
    },
    /**
     * Set the active class of selected button
     *
     * @remarks
     * This class has already defined
     */
    activeClass: {
      type: String,
      required: false,
      default: 'active',
    },
    fullWidth: Boolean,
  },
  data() {
    return {
      active: null as HTMLElement | null,
    }
  },
  computed: {},
  watch: {
    value() {
      this.initElements(false)
    },
  },
  mounted() {
    this.initElements(true)
  },
  methods: {
    initElements(attachEvent: boolean) {
      this.$el.querySelectorAll('.button').forEach((button, index) => {
        const text = button.querySelector('span')?.textContent
        const value = (this.values ? this.values[index] : text) as String
        if (value === this.value) {
          button.classList.add(this.activeClass)
          this.active = button as HTMLElement
        } else {
          button.classList.remove(this.activeClass)
        }
        if (!attachEvent) return
        button.addEventListener('click', () => {
          if (this.active != null) {
            this.active.classList.remove(this.activeClass)
          }
          this.active = button as HTMLElement
          this.active.classList.add(this.activeClass)
          this.$emit('input', value)
          if (this.action != null) {
            this.action(text)
          }
        })
      })
    },
  },
})
</script>

<style scoped lang="less" src="./ButtonGroup.less"></style>
