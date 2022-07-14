<template src="./Personalize.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  themes,
  flairs,
  ThemeKeys,
  FlairKeys,
  LanguageKeys,
} from '~/libraries/Iridium/settings/types'
import { SelectOption } from '~/types/ui/inputs'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'PersonalizeSettings',
  layout: 'settings',
  data() {
    return {
      settings: iridium.settings.state,
    }
  },
  computed: {
    ...mapState(['ui']),
    ThemeKeys: () => ThemeKeys,
    theme: {
      set(value: ThemeKeys) {
        if (value === ThemeKeys.DEFAULT) {
          this.flair = FlairKeys.SATELLITE
        }
        iridium.settings.set('/theme', value)
      },
      get(): ThemeKeys {
        return this.settings.theme
      },
    },
    flair: {
      set(value: FlairKeys) {
        iridium.settings.set('/flair', value)
      },
      get(): FlairKeys {
        return this.settings.flair
      },
    },
    language: {
      set(value: LanguageKeys) {
        iridium.settings.set('/language', value)
      },
      get(): string {
        return this.settings.language
      },
    },
    themeOptions(): SelectOption[] {
      return Object.entries(themes).map(([key, themeName]) => {
        return { value: key, text: themeName }
      })
    },
    flairOptions(): SelectOption[] {
      return Object.entries(flairs).map(([key, flair]) => {
        return { text: flair.name, value: key, color: flair.primary }
      })
    },
  },
})
</script>
