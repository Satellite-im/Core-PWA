<template src="./Personalize.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Themes, Flairs, FlairColors, ThemeNames } from '~/store/ui/types'
export default Vue.extend({
  name: 'PersonalizeSettings',
  layout: 'settings',
  data() {
    return {
      ThemeNames,
      themes: Themes,
      flairs: Flairs,
    }
  },
  computed: {
    ...mapState(['ui']),
    // React to v-model changes to echoCancellation and update
    // the state accordingly with the mutation
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
      get() {
        return this.ui.theme.base.value
      },
    },
    flair: {
      set(state) {
        const activeFlair = Flairs.find((fl) => {
          return fl.value === state
        })
        this.$store.commit('ui/updateFlair', activeFlair)
      },
      get() {
        return this.ui.theme.flair.value
      },
    },
  },
})
</script>
