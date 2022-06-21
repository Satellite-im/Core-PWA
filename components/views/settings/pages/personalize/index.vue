<template src="./Personalize.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Themes, Flairs, FlairColors, ThemeNames } from '~/store/ui/types'
import { SelectOption } from '~/types/ui/inputs'
export default Vue.extend({
  name: 'PersonalizeSettings',
  layout: 'settings',
  data() {
    return {
      ThemeNames,
      themes: Themes,
      flairs: Flairs,
      language: 'en_US',
    }
  },
  computed: {
    ...mapState(['ui']),
    theme: {
      set(state) {
        const activeTheme = Themes.find((th) => {
          return th.value === state
        })
        if (activeTheme?.value === ThemeNames.DEFAULT) {
          const flairValue = Flairs.find(
            (flair) => flair.value === FlairColors.SATELLITE,
          )
          if (flairValue) {
            this.$store.commit('ui/updateFlair', flairValue)
          }
        }
        this.$store.commit('ui/updateTheme', activeTheme)
      },
      get(): string {
        return this.ui.theme.base.value
      },
    },
    flair: {
      set(state) {
        const activeFlair = Flairs.find((f) => {
          return f.text === state
        })
        this.$store.commit('ui/updateFlair', activeFlair)
      },
      get(): string {
        return this.ui.theme.flair.text
      },
    },
    flairOptions(): SelectOption[] {
      return Flairs.map((f) => {
        return { text: f.text, value: f.text, color: f.value[0] }
      })
    },
  },
})
</script>
