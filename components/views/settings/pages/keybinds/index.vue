<template src="./Keybinds.html"></template>

<script lang="ts">
import Vue from 'vue'
import { windowsShortcuts, macShortcuts } from '~/utilities/HotkeyList'
import iridium from '~/libraries/Iridium/IridiumManager'
import { defaultKeybinds } from '~/libraries/Iridium/settings/types'

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
      defaultKeybinds,
    }
  },
  computed: {},
  methods: {
    setBinding(key: string, value: any) {
      iridium.settings.set(`/keybinds/${key}`, value)
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
