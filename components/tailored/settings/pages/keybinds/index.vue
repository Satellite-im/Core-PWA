<template src="./Keybinds.html"></template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'
import { mapState } from 'vuex'

import { Keybinds } from '~/components/mixins/UI/Keybinds'

export default Vue.extend({
  name: 'KeybindSettings',
  mixins: [Keybinds],
  layout: 'settings',
  data() {
    return {
      editingKeybind: {
        name: '',
        status: false,
        newString: '',
        error: false,
        errorMessage: '',
      },
    }
  },
  computed: {
    ...mapState(['settings']),
  },
  methods: {
    editKeybind(keybind: String) {
      this.clearKeybinds()
      window.addEventListener('keydown', this.recordKeybind)
      this.$data.editingKeybind.name = keybind
      this.$data.editingKeybind.status = true
      this.$data.editingKeybind.newString =
        this.settings.keybinds[this.$data.editingKeybind.name]
    },
    recordKeybind(e: any) {
      this.errorCheck(e)
      if (!this.$data.editingKeybind.error) {
        this.$data.editingKeybind.newString.length === 0
          ? (this.$data.editingKeybind.newString += e.key.toLowerCase())
          : (this.$data.editingKeybind.newString += `+${e.key.toLowerCase()}`)
      }
    },
    saveKeybind() {
      window.removeEventListener('keydown', this.recordKeybind)
      const keybindName = this.$data.editingKeybind.name
      const newKeybind = this.$data.editingKeybind.newString
      for (const key in this.settings.keybinds) {
        if (this.settings.keybinds[key] === newKeybind) {
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
      this.$data.editingKeybind.errorMessage = ''
      this.$data.editingKeybind.error = false
      this.activateKeybinds()
    },
    clearKeybind() {
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.errorMessage = ''
      this.$data.editingKeybind.error = false
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
    errorCheck(e: any) {
      const key = e.key.toLowerCase()
      const newString = this.$data.editingKeybind.newString
      const keyAlreadyBound = newString.includes(key)

      const modifiers = ['shift', 'control', 'alt', 'meta', 'tab', 'capslock']
      const isModifier = modifiers.includes(key)
      let hasAlphanumeric = false
      for (const char of newString.split('+')) {
        if (char.length === 1) {
          hasAlphanumeric = true
        }
      }
      const modifierAfterAlphanumeric = hasAlphanumeric && isModifier
      const blockedChars = ['capslock', 'delete']
      const hasBlockedChars = blockedChars.includes(key)

      if (keyAlreadyBound) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = 'Key already bound'
      } else if (modifierAfterAlphanumeric) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage =
          'Modifiers (Shift, Tab, Option, etc.) Must Come Before Alphanumerics'
      } else if (hasBlockedChars) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = 'Character Not Allowed'
      } else {
        this.$data.editingKeybind.error = false
        this.$data.editingKeybind.errorMessage = ''
      }
    },
  },
})
</script>
