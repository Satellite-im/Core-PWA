<template src="./Keybinds.html"></template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'
import { mapState } from 'vuex'
import { windowsShortcuts, macShortcuts } from '~/utilities/HotkeyList'
import { ModifierKeysEnum, BlockKeysEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  name: 'KeybindSettings',
  /*  mixins: [Keybinds], */
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
    recordKeybind(e: any) {
      this.errorCheck(e)
      if (!this.$data.editingKeybind.error) {
        this.$data.editingKeybind.newString.length === 0
          ? (this.$data.editingKeybind.newString += e.key.toLowerCase())
          : (this.$data.editingKeybind.newString += `+${e.key.toLowerCase()}`)
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
        if (this.settings.keybinds[key] === newKeybind) {
          this.$store.commit('settings/updateKeybinding', {
            keybindName: key,
            newKeybind: '',
          })
        }
      }
      this.$store.commit('settings/updateKeybinding', {
        keybindName,
        newKeybind,
      })
      this.$data.editingKeybind.newString = ''
      this.$data.editingKeybind.status = false
      this.$store.dispatch('ui/activateKeybinds')
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
     * @method resetKeybinds DocsTODO
     * @description
     * @example
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
     * @param e
     * @example
     */
    errorCheck(e: any) {
      const key = e.key.toLowerCase()
      const newString = this.$data.editingKeybind.newString
      const keyAlreadyBound = newString.includes(key)

      const keyAlreadyExist = navigator.userAgent.indexOf("Mac") > 0 ? 
        macShortcuts.includes(newString + '+' + key) : 
        windowsShortcuts.includes(newString + '+' + key)

      const modifiers = Object.values(ModifierKeysEnum)
      const isModifier = modifiers.includes(key)
      let hasAlphanumeric = false
      for (const char of newString.split('+')) {
        if (char.length === 1) {
          hasAlphanumeric = true
        }
      }
      const modifierAfterAlphanumeric = hasAlphanumeric && isModifier
      const blockedChars = Object.values(BlockKeysEnum)
      const hasBlockedChars = blockedChars.includes(key)

      if (keyAlreadyExist) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t('pages.settings.keybinds.systemHotkeyError')
      } else if (keyAlreadyBound) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t('pages.settings.keybinds.existHotkeyError')
      } else if (modifierAfterAlphanumeric) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t('pages.settings.keybinds.modifierHotkeyError')
      } else if (hasBlockedChars) {
        this.$data.editingKeybind.error = true
        this.$data.editingKeybind.errorMessage = this.$t('pages.settings.keybinds.editHotkeyError')
      } else {
        this.$data.editingKeybind.error = false
        this.$data.editingKeybind.errorMessage = ''
      }
    },
  },
})
</script>
