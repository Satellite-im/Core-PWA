<template src="./Sounds.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'NotificationsSettingsSounds',
  layout: 'sounds',
  data() {
    return {
      Sounds,
      audioSettings: iridium.settings.state.audio,
    }
  },
  computed: {
    sounds() {
      return this.audioSettings.sounds
    },
  },
  methods: {
    toggleSound(key: Sounds, isEnabled: boolean) {
      this.audioSettings.sounds[key] = isEnabled
    },
    toggleSounds(keys: Sounds[], isEnabled: boolean) {
      for (const key of keys) {
        this.audioSettings.sounds[key] = isEnabled
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Sounds.less"></style>
