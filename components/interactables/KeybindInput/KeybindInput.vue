<template src="./KeybindInput.html"></template>

<script lang="ts">
import Vue from 'vue'
import { PencilIcon, UndoIcon, XIcon, CheckIcon } from 'satellite-lucide-icons'

const modifiers = ['Control', 'Alt', 'Shift', 'Meta']
const initialModifiersState = Object.fromEntries(
  modifiers.map((m) => [m, false]),
)

export default Vue.extend({
  components: {
    PencilIcon,
    UndoIcon,
    XIcon,
    CheckIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    defaultValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      modifiers: { ...initialModifiersState },
      isListening: false,
      key: null as string | null,
      newKeybind: [] as string[],
    }
  },
  computed: {
    activeModifiers(): string[] {
      return Object.entries(this.modifiers)
        .filter(([_, state]) => state)
        .map(([m]) => m)
    },
    keybindKeys(): string[] {
      const keys = [...this.activeModifiers]
      if (this.key) {
        keys.push(this.key)
      }
      return keys
    },
    keys(): string[] {
      if (!this.isListening) {
        return this.value.split('-')
      }
      if (!this.activeModifiers.length || this.key) {
        return this.newKeybind
      }
      if (this.keybindKeys.length) {
        return this.keybindKeys
      }
      return []
    },
    canSave(): boolean {
      if (this.activeModifiers.length) {
        return false
      }
      return this.newKeybind.length > 1
    },
    canReset(): boolean {
      return this.value !== this.defaultValue
    },
    canClear(): boolean {
      return this.value !== ''
    },
  },
  methods: {
    edit() {
      this.addKeybindListener()
    },
    save() {
      if (!this.canSave) {
        return
      }
      this.$emit('change', this.newKeybind.join('-'))
      this.newKeybind = []
      this.removeKeybindListener()
    },
    cancel() {
      this.newKeybind = []
      this.removeKeybindListener()
    },
    clear() {
      this.$emit('change', '')
      this.newKeybind = []
      this.removeKeybindListener()
    },
    reset() {
      this.$emit('change', this.defaultValue)
      this.newKeybind = []
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
      event.stopPropagation()
      event.preventDefault()

      if (modifiers.includes(event.key)) {
        this.modifiers[event.key] = event.type === 'keydown'
        if (this.activeModifiers.length === 0) {
          this.key = null
        }
        return
      }

      if (this.activeModifiers.length === 0) {
        return
      }

      console.log(event)

      if (event.key === 'Dead') {
        return
      }

      this.key = event.key
      this.newKeybind = this.keybindKeys
    },
  },
})
</script>

<style scoped lang="less" src="./KeybindInput.less"></style>