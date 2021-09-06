<template src="./ButtonGroup.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: String,
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
  },
  data() {
    return {
      active: null as HTMLElement | null,
    }
  },
  computed: {},
  mounted() {
    this.$el.querySelectorAll('.button').forEach((button) => {
      const text = button.querySelector('span')?.textContent
      if (text === this.value) {
        button.classList.add(this.activeClass)
        this.active = button as HTMLElement
      }
      button.addEventListener('click', () => {
        if (this.active != null) {
          this.active.classList.remove(this.activeClass)
        }
        this.active = button as HTMLElement
        this.active.classList.add(this.activeClass)
        this.$emit('input', text)
        if (this.action != null) {
          this.action(text)
        }
      })
    })
  },
})
</script>

<style scoped lang="less" src="./ButtonGroup.less"></style>
