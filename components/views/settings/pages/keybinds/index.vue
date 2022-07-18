<template src="./Keybinds.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { windowsShortcuts, macShortcuts } from '~/utilities/HotkeyList'
import { specialKeys, keyboardRegex } from '~/utilities/Keybinds'
import { ModifierKeysEnum, BlockKeysEnum } from '~/libraries/Enums/enums'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  defaultKeybinds,
  KeybindKeys,
} from '~/libraries/Iridium/settings/types'

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
      settings: iridium.settings.state,
    }
  },
  computed: {},
  methods: {
    setBinding(key: string, value: any) {
      iridium.settings.set(`/keybinds/${key}`, value)
    },
    /**
     * @method editKeybind DocsTODO
     * @description
     * @param keybind
     * @example
     */
    editKeybind(keybind: string) {
      window.addEventListener('keydown', this.recordKeybind)
      this.editingKeybind = {
        ...this.editingKeybind,
        name: keybind,
        status: true,
        newString: defaultKeybinds[this.editingKeybind.name as KeybindKeys],
      }
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

      if (!this.editingKeybind.error) {
        this.editingKeybind.newString.length === 0
          ? (this.editingKeybind.newString += key)
          : (this.editingKeybind.newString += `+${key}`)
      }
    },
    /**
     * @method saveKeybind DocsTODO
     * @description
     * @example
     */
    saveKeybind() {
      window.removeEventListener('keydown', this.recordKeybind)
      const { name, newString } = this.editingKeybind

      if (this.checkSystemHotkey(newString)) {
        this.editingKeybind.error = true
        this.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.systemHotkeyError',
        ) as string
        return
      }

      iridium.settings.set(`/keybinds/${name}`, newString)
      this.editingKeybind.newString = ''
      this.editingKeybind.status = false
      this.$store.dispatch('ui/activateKeybinds')
    },
    /**
     * @method cancelKeybind DocsTODO
     * @description
     * @example
     */
    cancelKeybind() {
      window.removeEventListener('keydown', this.recordKeybind)
      this.editingKeybind.newString = ''
      this.editingKeybind.status = false
      this.editingKeybind.errorMessage = ''
      this.editingKeybind.error = false
      this.$store.dispatch('ui/activateKeybinds')
    },
    /**
     * @method clearKeybind DocsTODO
     * @description
     * @example
     */
    clearKeybind() {
      this.editingKeybind.newString = ''
      this.editingKeybind.errorMessage = ''
      this.editingKeybind.error = false
    },
    /**
     * @method resetKeybinds
     * @description Resets keybind local state back to hard-coded defaults
     * @example resetKeybinds()
     */
    resetKeybinds() {
      for (const [key, value] of Object.entries(defaultKeybinds)) {
        iridium.settings.set(`/keybinds/${key}`, value)
      }
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

      const newString = this.editingKeybind.newString

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
        this.editingKeybind.error = true
        this.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.singleHotkeyError',
        ) as string
      } else if (keyAlreadyExist) {
        this.editingKeybind.error = true
        this.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.systemHotkeyError',
        ) as string
      } else if (keyAlreadyBound) {
        this.editingKeybind.error = true
        this.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.existHotkeyError',
        ) as string
      } else if (modifierAfterAlphanumeric) {
        this.editingKeybind.error = true
        this.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.modifierHotkeyError',
        ) as string
      } else if (hasBlockedChars) {
        this.editingKeybind.error = true
        this.editingKeybind.errorMessage = this.$t(
          'pages.settings.keybinds.editHotkeyError',
        ) as string
      } else {
        this.editingKeybind.error = false
        this.editingKeybind.errorMessage = ''
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
