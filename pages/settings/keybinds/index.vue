<template src="./Keybinds.html"></template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'
import { Keybinds } from '~/components/mixins/UI/Keybinds'

export default Vue.extend({
  name: 'KeybindSettings',
  mixins: [Keybinds],
  layout: 'settings',
  data() {
    return {
      editingKeybind: { name: '', status: false, newString: '' },
    }
  },
  methods: {
    editKeybind(keybind: String) {
      this.clearKeybinds()
      window.addEventListener('keydown', this.recordKeybind)
      this.$data.editingKeybind.name = keybind
      this.$data.editingKeybind.status = true
      this.$data.editingKeybind.newString =
        this.$store.state.settings.keybinds[this.$data.editingKeybind.name]
    },
    recordKeybind(e: any) {
      this.$data.editingKeybind.newString.length === 0
        ? (this.$data.editingKeybind.newString += e.key.toLowerCase())
        : (this.$data.editingKeybind.newString += `+${e.key.toLowerCase()}`)
    },
    saveKeybind() {
      window.removeEventListener('keydown', this.recordKeybind)
      const keybindName = this.$data.editingKeybind.name
      const newKeybind = this.$data.editingKeybind.newString
      for (const key in this.$store.state.settings.keybinds) {
        if (this.$store.state.settings.keybinds[key] === newKeybind) {
          this.$store.commit('updateKeybinding', {
            keybindName: key,
            newKeybind: '',
          })
        }
      }
      this.$store.commit('updateKeybinding', { keybindName, newKeybind })
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.status = false
      this.activateKeybinds()
    },
    cancelKeybind() {
      window.removeEventListener('keydown', this.recordKeybind)
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.status = false
      this.activateKeybinds()
    },
    clearKeybind() {
      this.$data.editingKeybind.newString = ''
    },
    resetKeybinds() {
      this.$store.commit('updateKeybinding', {
        keybindName: 'toggleMute',
        newKeybind: 'alt+m',
      })
      this.$store.commit('updateKeybinding', {
        keybindName: 'toggleDeafen',
        newKeybind: 'alt+d',
      })
      this.$store.commit('updateKeybinding', {
        keybindName: 'openSettings',
        newKeybind: 'alt+s',
      })
      this.$store.commit('updateKeybinding', {
        keybindName: 'callActiveChat',
        newKeybind: 'alt+c',
      })
      this.activateKeybinds()
    },
  },
})
</script>
