<template src="./Keybinds.html"></template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import Mousetrap from 'mousetrap'

export default Vue.extend({
  name: 'KeybindSettings',
  layout: 'settings',
  data() {
    return {
      keybinds: {
        toggleMute: 'ALT+M',
        toggleDeafen: 'ALT+D',
        openSettings: 'ALT+S',
        callActiveChat: 'ALT+C',
      },
      editingKeybind: { name: '', status: false, newString: '' },
    }
  },
  mounted() {
    window.addEventListener('keydown', this.recordKeybind)
  },
  destroyed() {
    window.removeEventListener('keydown', this.recordKeybind)
  },
  methods: {
    editKeybind(keybind: String) {
      this.$data.editingKeybind.name = keybind
      this.$data.editingKeybind.status = true
      this.$data.editingKeybind.newString =
        this.$data.keybinds[this.$data.editingKeybind.name]
    },
    recordKeybind(e: any) {
      if (this.$data.editingKeybind.status) {
        this.$data.editingKeybind.newString.length === 0
          ? (this.$data.editingKeybind.newString += e.key.toUpperCase())
          : (this.$data.editingKeybind.newString += `+${e.key.toUpperCase()}`)
      }
    },
    saveKeybind() {
      const currKeybind = this.$data.editingKeybind.name
      this.$data.keybinds[currKeybind] = this.$data.editingKeybind.newString
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.status = false
    },
    cancelKeybind() {
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.status = false
    },
    clearKeybind() {
      this.$data.editingKeybind.newString = ''
    },
    resetKeybinds() {
      this.$data.keybinds = {
        toggleMute: 'ALT+M',
        toggleDeafen: 'ALT+D',
        openSettings: 'ALT+S',
        callActiveChat: 'ALT+C',
      }
    },
  },
})
</script>
