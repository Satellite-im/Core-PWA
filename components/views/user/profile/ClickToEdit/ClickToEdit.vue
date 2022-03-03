<template src="./ClickToEdit.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: 'Click to add note',
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      html: '',
      focused: false,
    }
  },
  mounted() {
    this.updateHTML(this.$props.value)
  },
  methods: {
    updateHTML(value: string) {
      const el = this.$refs.input as HTMLElement
      this.html = value
      if (this.focused) {
        el.innerHTML = value
      } else {
        const htmlString = value.replace(/<[^>]+>/g, '')
        el.innerHTML = htmlString ? value : this.$props.placeholder
      }
    },
    input(event: Event) {
      const el = event.target as HTMLElement
      this.html = el.innerHTML
    },
    focus() {
      this.focused = true
      const htmlString = this.value.replace(/<[^>]+>/g, '')
      this.updateHTML(!htmlString ? htmlString : this.value)
    },
    blur() {
      this.focused = false
      this.updateHTML(this.html)
      this.$emit('change', this.html)
    },
  },
})
</script>

<style scoped lang="less" src="./ClickToEdit.less"></style>
