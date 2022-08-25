<template src="./KeybindInput.html"></template>

<script lang="ts">
import Vue from 'vue'
import { PencilIcon, UndoIcon, XIcon, CheckIcon } from 'satellite-lucide-icons'
import {
  windowsShortcuts,
  macShortcuts,
  keyCodeToKey,
} from '~/utilities/Keyboard'

const modifiers = ['Control', 'Alt', 'Shift', 'Meta']
const initialModifiersState = Object.fromEntries(
  modifiers.map((m) => [m, false]),
)

const separator = '+'

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
        return this.value.split(separator)
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
      if (this.activeModifiers.length || this.isReservedKeybind) {
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
    isReservedKeybind(): boolean {
      return navigator.userAgent.indexOf('Mac') > 0
        ? macShortcuts.includes(this.newKeybindString)
        : windowsShortcuts.includes(this.newKeybindString)
    },
    newKeybindString(): string {
      return this.newKeybind.join(separator).toLowerCase()
    },
  },
  beforeDestroy() {
    this.removeKeybindListener()
  },
  methods: {
    edit() {
      this.addKeybindListener()
    },
    save() {
      if (!this.canSave) {
        return
      }
      this.$emit('change', this.newKeybindString)
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
        const editButton = this.$refs.editButton as HTMLButtonElement
        if (event.keyCode === 13) {
          this.save()
          editButton.focus()
        } else if (event.keyCode === 27) {
          this.cancel()
          editButton.focus()
        }
        return
      }

      // To keep keys uniform across platforms, we need to convert the keycode to a key
      this.key = keyCodeToKey[event.keyCode]
      this.newKeybind = this.keybindKeys
    },
  },
})
</script>

<style scoped lang="less" src="./KeybindInput.less"></style>
