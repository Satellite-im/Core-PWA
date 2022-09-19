<template src="./Keybinds.html"></template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { defaultKeybinds } from '~/libraries/Iridium/settings/types'

export default Vue.extend({
  name: 'KeybindSettings',
  layout: 'settings',
  data() {
    return {
      settings: iridium.settings.state,
      defaultKeybinds,
    }
  },
  methods: {
    async setBinding(key: string, value: any) {
      await iridium.settings.set(`/keybinds/${key}`, value)
      this.$store.dispatch('ui/activateKeybinds')
    },
    async resetKeybinds() {
      Object.keys(defaultKeybinds).forEach((key) => {
        iridium.settings.set(`/keybinds/${key}`, defaultKeybinds[key])
      })

      this.$store.dispatch('ui/activateKeybinds')
    },
  },
})
</script>

<style scoped lang="less" src="./Keybinds.less"></style>
