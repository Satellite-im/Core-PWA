<template src="./KeybindInput.html"></template>

<script lang="ts">
import Vue from 'vue'

const modifiers = ['Control', 'Alt', 'Shift', 'Meta']
const initialModifiersState = Object.fromEntries(
  modifiers.map((m) => [m, false]),
)

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      modifiers: { ...initialModifiersState },
      keybindPreview: null as string | null,
      isListening: false,
    }
  },
  computed: {
    activeModifiers() {
      return Object.entries(this.modifiers)
        .filter(([_, state]) => state)
        .map(([m]) => m)
    },
  },
  methods: {
    handleFocus() {
      this.addKeybindListener()
    },
    handleBlur() {
      this.removeKeybindListener()
    },
    addKeybindListener() {
      window.addEventListener('keydown', this.handleKeyEvent)
      window.addEventListener('keyup', this.handleKeyEvent)
      this.isListening = true
    },
    removeKeybindListener() {
      window.removeEventListener('keydown', this.handleKeyEvent)
      window.removeEventListener('keyup', this.handleKeyEvent)
      this.isListening = false
      Object.assign(this.modifiers, initialModifiersState)
    },
    handleKeyEvent(event: KeyboardEvent) {
      console.log('event', event)
      event.stopPropagation()
      event.preventDefault()

      if (modifiers.includes(event.key)) {
        this.modifiers[event.key] = event.type === 'keydown'
        this.updateKeybindPreview()
        return
      }

      if (modifiers.length === 0) {
        return
      }

      this.$emit('change', this.getNewKeybind(event.key))
      const target = event.target as HTMLInputElement
      target.blur()
    },
    updateKeybindPreview() {
      this.keybindPreview = this.activeModifiers.join('-')
    },
    getNewKeybind(key: string) {
      return [...this.activeModifiers, key].join('-')
    },
  },
})
</script>

<style scoped lang="less" src="./KeybindInput.less"></style>
