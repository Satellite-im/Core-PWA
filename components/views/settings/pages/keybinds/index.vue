<template src="./Keybinds.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { windowsShortcuts, macShortcuts } from '~/utilities/HotkeyList'

import { specialKeys, keyboardRegex } from '~/utilities/Keybinds'

import { ModifierKeysEnum, BlockKeysEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  name: 'KeybindSettings',
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
    /**
     * @method editKeybind DocsTODO
     * @description
     * @param keybind
     * @example
     */
    editKeybind(keybind: String) {
      this.$store.dispatch('ui/clearKeybinds')
      window.addEventListener('keydown', this.recordKeybind)
      this.$data.editingKeybind.name = keybind
      this.$data.editingKeybind.status = true
      this.$data.editingKeybind.newString =
        this.settings.keybinds[this.$data.editingKeybind.name]
    },
    /**
     * @method recordKeybind DocsTODO
     * @description
     * @param e
     * @example
     */
    recordKeybind(e: KeyboardEvent) {
      let key = ''

      const char = e.key.toLowerCase()
      if (!char) return

      const specialKey = specialKeys[char]

      if (specialKey) {
        key = specialKey
      } else if (char.match(keyboardRegex)) {
        key = char
      } else {
        return
      }

      this.errorCheck(key)

      if (!this.$data.editingKeybind.error) {
        this.$data.editingKeybind.newString.length === 0
          ? (this.$data.editingKeybind.newString += key)
          : (this.$data.editingKeybind.newString += `+${key}`)
      }
    },
    /**
     * @method saveKeybind DocsTODO
     * @description
     * @example
     */
    saveKeybind() {
      window.removeEventListener('keydown', this.recordKeybind)
      const keybindName = this.$data.editingKeybind.name
      const newKeybind = this.$data.editingKeybind.newString

      for (const key in this.settings.keybinds) {
        if (this.checkSystemHotkey(this.settings.keybinds[key])) {
          this.$data.editingKeybind.error = true
          this.$data.editingKeybind.errorMessage = this.$t(
            'pages.settings.keybinds.systemHotkeyError',
          )
          this.$store.commit('settings/updateKeybinding', {
            keybindName: key,
            newKeybind: '',
          })
        }

        if (this.settings.keybinds[key] === newKeybind) {
          this.$store.commit('settings/updateKeybinding', {
            keybindName: key,
            newKeybind: '',
          })
        }
      }
      if (!this.checkSystemHotkey(newKeybind)) {
        this.$store.commit('settings/updateKeybinding', {
          keybindName,
          newKeybind,
        })
        this.$data.editingKeybind.newString = ''
        this.$data.editingKeybind.status = false
        this.$store.dispatch('ui/activateKeybinds')
      } else {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.systemHotkeyError',
        )
      }
    },
    /**
     * @method cancelKeybind DocsTODO
     * @description
     * @example
     */
    cancelKeybind() {
      window.removeEventListener('keydown', this.recordKeybind)
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.status = false
      this.$data.editingKeybind.errorMessage = ''
      this.$data.editingKeybind.error = false
      this.$store.dispatch('ui/activateKeybinds')
    },
    /**
     * @method clearKeybind DocsTODO
     * @description
     * @example
     */
    clearKeybind() {
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.errorMessage = ''
      this.$data.editingKeybind.error = false
    },
    /**
     * @method resetKeybinds
     * @description Resets keybind local state back to hard-coded defaults
     * @example resetKeybinds()
     */
    resetKeybinds() {
      this.$store.commit('settings/updateKeybinding', {
        keybindName: 'toggleMute',
        newKeybind: 'alt+m',
      })
      this.$store.commit('settings/updateKeybinding', {
        keybindName: 'toggleDeafen',
        newKeybind: 'alt+d',
      })
      this.$store.commit('settings/updateKeybinding', {
        keybindName: 'openSettings',
        newKeybind: 'alt+s',
      })
      this.$store.commit('settings/updateKeybinding', {
        keybindName: 'callActiveChat',
        newKeybind: 'alt+c',
      })
      this.$store.dispatch('ui/activateKeybinds')
    },
    /**
     * @method errorCheck DocsTODO
     * @description
     * @param key
     * @example
     */
    errorCheck(key: string) {
      if (!key) return

      const newString = this.$data.editingKeybind.newString

      const keyAlreadyBound = newString.split('+').includes(key)

      const keyAlreadyExist = this.checkSystemHotkey(newString + '+' + key)

      const isModifier = key in ModifierKeysEnum

      const hasAlphanumeric = newString
        .split('+')
        .some((char: string) => char.length === 1)

      const singleKeyAlreadyExist = key.length === 1 && hasAlphanumeric

      const modifierAfterAlphanumeric = hasAlphanumeric && isModifier

      const hasBlockedChars = key in BlockKeysEnum

      if (singleKeyAlreadyExist) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.singleHotkeyError',
        )
      } else if (keyAlreadyExist) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.systemHotkeyError',
        )
      } else if (keyAlreadyBound) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.existHotkeyError',
        )
      } else if (modifierAfterAlphanumeric) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.modifierHotkeyError',
        )
      } else if (hasBlockedChars) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.editHotkeyError',
        )
      } else {
        this.$data.editingKeybind.error = false
        this.$data.editingKeybind.errorMessage = ''
      }
    },
    checkSystemHotkey(keys: string) {
      return navigator.userAgent.indexOf('Mac') > 0
        ? macShortcuts.includes(keys)
        : windowsShortcuts.includes(keys)
    },
  },
})
</script>

<style scoped lang="less" src="./Keybinds.less"></style>
